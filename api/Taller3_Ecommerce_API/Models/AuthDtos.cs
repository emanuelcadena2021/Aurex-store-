using System.ComponentModel.DataAnnotations;

namespace Taller3_Ecommerce_API.Models;

public record RegisterRequest(
    [Required, MinLength(2)] string Name,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record AuthResponse(string Token, string Name, string Email, string Role);
