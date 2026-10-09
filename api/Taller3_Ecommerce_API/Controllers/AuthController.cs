using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Taller3_Ecommerce_API.Data;
using Taller3_Ecommerce_API.Models;

namespace Taller3_Ecommerce_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;
    private readonly PasswordHasher<User> _hasher = new();

    public AuthController(AppDbContext db, IConfiguration config, ILogger<AuthController> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Ya existe una cuenta con ese correo." });

        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName?.Trim() ?? string.Empty,
            Email = email,
            AcceptsMarketing = request.AcceptsMarketing
        };
        user.PasswordHash = _hasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Ok(CreateResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null ||
            _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Correo o contraseña incorrectos." });

        return Ok(CreateResponse(user));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<object>> Me()
    {
        var user = await _db.Users.FindAsync(CurrentUserId());
        if (user is null) return Unauthorized();
        return Ok(new { user.FirstName, user.LastName, user.Email, user.Role, user.AcceptsMarketing, user.CreatedAt });
    }

    // Recuperar contraseña: genera un enlace de un solo uso válido por 1 hora.
    // No hay servidor de correo en el taller, así que el enlace se muestra en la consola de la API.
    [HttpPost("recover")]
    public async Task<IActionResult> Recover(RecoverRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is not null)
        {
            user.ResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(24)).ToLowerInvariant();
            user.ResetExpires = DateTime.UtcNow.AddHours(1);
            await _db.SaveChangesAsync();
            _logger.LogWarning("Enlace para restablecer la contraseña de {Email}: http://localhost:4200/cuenta/restablecer?token={Token}",
                user.Email, user.ResetToken);
        }

        return Ok(new { message = "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña." });
    }

    [HttpPost("reset")]
    public async Task<ActionResult<AuthResponse>> Reset(ResetPasswordRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.ResetToken == request.Token);
        if (user is null || user.ResetExpires < DateTime.UtcNow)
            return BadRequest(new { message = "El enlace no es válido o ya venció. Solicita uno nuevo." });

        user.PasswordHash = _hasher.HashPassword(user, request.Password);
        user.ResetToken = null;
        user.ResetExpires = null;
        await _db.SaveChangesAsync();
        return Ok(CreateResponse(user));
    }

    private int CurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private AuthResponse CreateResponse(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FirstName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.FirstName, user.LastName, user.Email, user.Role);
    }
}
