-- =====================================================================
-- Aurex Store · Taller 3 · Base de datos MySQL
-- Ejecutar en MySQL Workbench (Ctrl+Shift+Enter).
-- Recrea las tablas de la tienda: productos, usuarios, pedidos y la
-- configuración de la página (textos del banner, sobre nosotros, contacto).
-- Se puede ejecutar varias veces: siempre deja la base limpia y completa.
-- =====================================================================
CREATE DATABASE IF NOT EXISTS taller3_ecommerce
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taller3_ecommerce;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS store_settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- Productos del catálogo (la categoría alimenta los filtros de la portada)
-- ---------------------------------------------------------------------
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(60) NOT NULL DEFAULT 'Accesorios',
  price DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description VARCHAR(500) NOT NULL DEFAULT '',
  image_url VARCHAR(500) NOT NULL DEFAULT ''
);

INSERT INTO products (name, category, price, stock, description, image_url) VALUES
('Audífonos Pulse X',     'Audio',       289900,  14, 'Cancelación activa de ruido y 40 h de batería.',   '/assets/img/productos/audifonos-pulse-x.svg'),
('Parlante Volt 360',     'Audio',       219900,   4, 'Sonido envolvente, resistente al agua IP67.',      '/assets/img/productos/parlante-volt-360.svg'),
('Teclado Mecánico K87',  'Gaming',      249900,  22, 'Switches rojos, retroiluminación RGB.',            '/assets/img/productos/teclado-mecanico-k87.svg'),
('Mouse Viper Pro',       'Gaming',      159900,  31, '26.000 DPI, 58 g, inalámbrico.',                   '/assets/img/productos/mouse-viper-pro.svg'),
('Control Inferno',       'Gaming',      199900,   3, 'Compatible con PC y consola, gatillos hápticos.',  '/assets/img/productos/control-inferno.svg'),
('Laptop Aurex 14',       'Computación', 3299900,  6, 'Ryzen 7, 16 GB RAM, SSD 1 TB.',                    '/assets/img/productos/laptop-aurex-14.svg'),
('Monitor Crimson 27"',   'Computación', 1149900,  9, 'QHD 165 Hz, panel IPS.',                           '/assets/img/productos/monitor-crimson-27.svg'),
('Smartphone Nova R',     'Celulares',   1899900, 12, 'Pantalla AMOLED 6,7", 256 GB.',                    '/assets/img/productos/smartphone-nova-r.svg'),
('Smartwatch Blaze',      'Accesorios',  399900,  18, 'GPS, ritmo cardíaco, 10 días de batería.',         '/assets/img/productos/smartwatch-blaze.svg'),
('Cargador GaN 65 W',     'Accesorios',  119900,  40, 'Tres puertos, carga rápida para laptop.',          '/assets/img/productos/cargador-gan-65w.svg');

-- ---------------------------------------------------------------------
-- Clientes (login y registro). La contraseña se guarda cifrada desde la API.
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  accepts_marketing TINYINT(1) NOT NULL DEFAULT 0,
  role VARCHAR(30) NOT NULL DEFAULT 'Cliente',
  reset_token VARCHAR(100) NULL,
  reset_expires DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

-- ---------------------------------------------------------------------
-- Pedidos (se crean desde el carrito con "Confirmar pedido", pago contra entrega)
-- ---------------------------------------------------------------------
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  customer_name VARCHAR(150) NOT NULL,
  address VARCHAR(300) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
ALTER TABLE orders AUTO_INCREMENT = 1001;

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- Configuración de la página (equivale al editor de temas de Shopify).
-- Cambia estos valores en Workbench y recarga la página para verlos.
-- ---------------------------------------------------------------------
CREATE TABLE store_settings (
  setting_key VARCHAR(60) PRIMARY KEY,
  setting_value TEXT NOT NULL
);

INSERT INTO store_settings (setting_key, setting_value) VALUES
-- Banner principal
('hero_image',        ''),
('eyebrow',           'CUIDADO PERSONAL • BIENESTAR • CALIDAD'),
('title',             'Cuida de ti.'),
('title_red',         'Siéntete mejor.'),
('title_script',      'Todos los días.'),
('text',              'Productos seleccionados para acompañarte en tu rutina de cuidado personal y bienestar.'),
('button',            'Descubrir productos'),
('button2',           ''),
('catalog_title',     'Productos destacados'),
-- Sobre nosotros
('about_image',       '/assets/img/aurex-logo-fondo-negro.png'),
('about_eyebrow',     'Sobre nosotros'),
('about_title',       'Somos Aurex,'),
('about_title_red',   'tu tienda de bienestar.'),
('about_text',        '<p>Somos una tienda colombiana dedicada al cuidado personal, el bienestar y el fitness. Seleccionamos cada producto pensando en tu calidad de vida.</p><p>Enviamos a toda Colombia y te acompañamos antes, durante y después de tu compra.</p>'),
('about_values',      '[{"number":"+1.000","label":"clientes felices"},{"number":"48 h","label":"entrega promedio"},{"number":"100%","label":"compra segura"}]'),
-- Contacto
('whatsapp',          '+57 322  6730896'),
('whatsapp_button',   'Escríbenos por WhatsApp'),
('whatsapp_message',  'Hola Aurex, quiero más información'),
('whatsapp_link',     ''),
('email',             'aurexelite2026@gmail.com'),
('address',           'Colombia'),
('hours',             'Lunes a sábado, 8:00 a. m. – 6:00 p. m.'),
('instagram',         ''),
('facebook',          ''),
('tiktok',            '');

-- Consultas útiles para revisar en Workbench
SELECT * FROM products;
SELECT * FROM store_settings;
