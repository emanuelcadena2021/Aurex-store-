using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Taller3_Ecommerce_API.Data;

namespace Taller3_Ecommerce_API.Controllers;

// Textos e imágenes configurables de la página (banner, sobre nosotros, contacto),
// guardados en la tabla store_settings.
[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SettingsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, string>>> Get()
        => Ok(await _db.StoreSettings.AsNoTracking().ToDictionaryAsync(s => s.Key, s => s.Value));
}
