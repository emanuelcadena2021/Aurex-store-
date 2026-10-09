using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Taller3_Ecommerce_API.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("accepts_marketing")]
        public bool AcceptsMarketing { get; set; }

        [Column("role")]
        public string Role { get; set; } = "Cliente";

        [Column("reset_token")]
        public string? ResetToken { get; set; }

        [Column("reset_expires")]
        public DateTime? ResetExpires { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
