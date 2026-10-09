using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Taller3_Ecommerce_API.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("customer_name")]
        public string CustomerName { get; set; } = string.Empty;

        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Column("total")]
        public decimal Total { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Pendiente";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<OrderItem> Items { get; set; } = new();
    }

    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; } = string.Empty;

        [Column("unit_price")]
        public decimal UnitPrice { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }
    }

    [Table("store_settings")]
    public class StoreSetting
    {
        [Key]
        [Column("setting_key")]
        public string Key { get; set; } = string.Empty;

        [Column("setting_value")]
        public string Value { get; set; } = string.Empty;
    }
}
