using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Taller3_Ecommerce_API.Data;
using Taller3_Ecommerce_API.Models;

namespace Taller3_Ecommerce_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    // Crea el pedido desde el carrito (pago contra entrega). Si el cliente inició sesión,
    // el pedido queda asociado a su cuenta y aparece en "Mi cuenta".
    [HttpPost]
    public async Task<ActionResult<Order>> Create(CreateOrderRequest request)
    {
        var ids = request.Items.Select(i => i.ProductId).ToList();
        var products = await _db.Products.Where(p => ids.Contains(p.Id)).ToDictionaryAsync(p => p.Id);

        var order = new Order
        {
            UserId = CurrentUserId(),
            CustomerName = request.CustomerName.Trim(),
            Address = request.Address.Trim()
        };

        foreach (var line in request.Items.GroupBy(i => i.ProductId))
        {
            var quantity = line.Sum(i => i.Quantity);
            if (!products.TryGetValue(line.Key, out var product))
                return BadRequest(new { message = "Uno de los productos ya no existe." });
            if (product.Stock < quantity)
                return BadRequest(new { message = $"Solo quedan {product.Stock} unidades de {product.Name}." });

            product.Stock -= quantity;
            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = quantity
            });
        }

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return Ok(order);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<Order>>> Mine()
    {
        var userId = CurrentUserId();
        return Ok(await _db.Orders.AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync());
    }

    private int? CurrentUserId()
        => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
}
