using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Taller3_Ecommerce_API.Data;
using Taller3_Ecommerce_API.Models;

namespace Taller3_Ecommerce_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db) => _db = db;

    // GET /api/Products?q=mouse&category=Gaming
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll(string? q, string? category)
    {
        var query = _db.Products.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(p => p.Name.Contains(q) || p.Description.Contains(q));
        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category == category);
        return Ok(await query.OrderBy(p => p.Id).ToListAsync());
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        => Ok(await _db.Products.Select(p => p.Category).Distinct().ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Product product)
    {
        var existing = await _db.Products.FindAsync(id);
        if (existing is null) return NotFound();

        existing.Name = product.Name;
        existing.Category = product.Category;
        existing.Price = product.Price;
        existing.Stock = product.Stock;
        existing.Description = product.Description;
        existing.ImageUrl = product.ImageUrl;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
