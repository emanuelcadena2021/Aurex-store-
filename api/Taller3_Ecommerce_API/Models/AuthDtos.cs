using System.ComponentModel.DataAnnotations;

namespace Taller3_Ecommerce_API.Models;

public record RegisterRequest(
    [Required, MinLength(2)] string FirstName,
    string? LastName,
    [Required, EmailAddress] string Email,
    [Required, MinLength(5)] string Password,
    bool AcceptsMarketing = false);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record RecoverRequest([Required, EmailAddress] string Email);

public record ResetPasswordRequest(
    [Required] string Token,
    [Required, MinLength(5)] string Password);

public record AuthResponse(string Token, string FirstName, string LastName, string Email, string Role);

public record OrderItemRequest([Range(1, int.MaxValue)] int ProductId, [Range(1, 99)] int Quantity);

public record CreateOrderRequest(
    [Required, MinLength(2)] string CustomerName,
    [Required, MinLength(4)] string Address,
    [Required, MinLength(1)] List<OrderItemRequest> Items);
