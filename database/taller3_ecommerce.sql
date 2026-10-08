-- Ejecutar en MySQL Workbench (Ctrl+Shift+Enter) para recrear la base completa
CREATE DATABASE IF NOT EXISTS taller3_ecommerce;
USE taller3_ecommerce;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description VARCHAR(500) NOT NULL DEFAULT '',
  image_url VARCHAR(500) NOT NULL DEFAULT ''
);

-- Inserta solo los productos que aún no existen (se puede ejecutar varias veces sin duplicar)
INSERT INTO products (name, price, stock, description, image_url)
SELECT v.* FROM (
  SELECT 'Audífonos Pulse X', 289900, 14, 'Cancelación activa de ruido y 40 h de batería.', 'https://picsum.photos/seed/audifonos/400/300'
  UNION ALL SELECT 'Parlante Volt 360', 219900, 4, 'Sonido envolvente, resistente al agua IP67.', 'https://picsum.photos/seed/parlante/400/300'
  UNION ALL SELECT 'Teclado Mecánico K87', 249900, 22, 'Switches rojos, retroiluminación RGB.', 'https://picsum.photos/seed/teclado/400/300'
  UNION ALL SELECT 'Mouse Viper Pro', 159900, 31, '26.000 DPI, 58 g, inalámbrico.', 'https://picsum.photos/seed/mouse/400/300'
  UNION ALL SELECT 'Control Inferno', 199900, 3, 'Compatible con PC y consola, gatillos hápticos.', 'https://picsum.photos/seed/control/400/300'
  UNION ALL SELECT 'Laptop Aurex 14', 3299900, 6, 'Ryzen 7, 16 GB RAM, SSD 1 TB.', 'https://picsum.photos/seed/laptop/400/300'
  UNION ALL SELECT 'Monitor Crimson 27', 1149900, 9, 'QHD 165 Hz, panel IPS.', 'https://picsum.photos/seed/monitor/400/300'
  UNION ALL SELECT 'Smartphone Nova R', 1899900, 12, 'Pantalla AMOLED 6,7", 256 GB.', 'https://picsum.photos/seed/celular/400/300'
  UNION ALL SELECT 'Smartwatch Blaze', 399900, 18, 'GPS, ritmo cardíaco, 10 días de batería.', 'https://picsum.photos/seed/reloj/400/300'
  UNION ALL SELECT 'Cargador GaN 65 W', 119900, 40, 'Tres puertos, carga rápida para laptop.', 'https://picsum.photos/seed/cargador/400/300'
) AS v (name, price, stock, description, image_url)
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = v.name);

-- Usuarios para el login (las contraseñas se guardan cifradas desde la API)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'Cliente',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);
