# Aurex Store · Taller 3

Copia de la tienda de Shopify (rama `shopify-original`) adaptada a:

**Angular → API ASP.NET Core → Entity Framework → MySQL**

| Carpeta | Qué es | Se abre con |
| --- | --- | --- |
| `database/` | Script de la base `taller3_ecommerce` | MySQL Workbench |
| `api/Taller3_Ecommerce_API/` | API .NET 10 + EF Core + Pomelo MySQL + JWT | Visual Studio Community |
| `frontend/` | Página de la tienda en Angular 20 | VS Code |
| `branding/` | Logos de Aurex Store | — |

## Cómo abrir la página

1. **MySQL Workbench**: abre `database/taller3_ecommerce.sql` y ejecútalo (Ctrl+Shift+Enter).
   Crea las tablas `products`, `users`, `orders`, `order_items` y `store_settings`.
   Usuario `root`, contraseña `informatica`, puerto 3306 (se cambia en `api/Taller3_Ecommerce_API/appsettings.json`).
2. **Visual Studio**: abre `api/Taller3_Ecommerce_API/Taller3_Ecommerce_API.csproj`, elige el perfil **http** y ejecuta.
   O por consola: `dotnet run --launch-profile http`. Queda en http://localhost:5000
3. **VS Code**: abre la carpeta `frontend/` y en la terminal:
   ```
   npm install --legacy-peer-deps
   npm start
   ```
4. Abre **http://localhost:4200** en Chrome.

## Qué tiene la página

- **Portada** igual a la de Shopify: banner, insignias, catálogo con filtros por categoría y buscador, sección *Sobre nosotros* con WhatsApp y contacto.
- **Carrito** lateral y página `/carrito`. "Confirmar pedido" guarda el pedido en MySQL (pago contra entrega) y descuenta el stock.
- **Producto** en `/producto/:id`.
- **Login y registro** (`/cuenta/login`, `/cuenta/registro`) con las mismas pantallas del tema: pestañas, ver/ocultar contraseña, confirmación y opción de ofertas.
- **Recuperar contraseña**: el enlace para crear una nueva aparece en la consola de la API (no hay servidor de correo).
- **Mi cuenta** (`/cuenta`): "Hola, [nombre]", pedidos y datos. El encabezado también saluda al cliente.

## Configuración de la página

Los textos del banner, *Sobre nosotros*, WhatsApp, correo, horario y redes están en la tabla
`store_settings` (igual que el editor de temas de Shopify). Cámbialos en Workbench y recarga la página:

```sql
UPDATE store_settings SET setting_value = 'Nuevo título' WHERE setting_key = 'title';
```

Para poner una imagen de fondo en el banner, copia la imagen en `frontend/src/assets/img/`
y guarda su ruta en `hero_image` (por ejemplo `/assets/img/hero.png`).

## Endpoints de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/Products` | Productos (`?q=` busca, `?category=` filtra) |
| GET | `/api/Products/{id}` | Un producto |
| POST/PUT/DELETE | `/api/Products` | Crear, editar o borrar (requiere token JWT) |
| GET | `/api/Settings` | Textos configurables de la página |
| POST | `/api/Auth/register` | Crear cuenta |
| POST | `/api/Auth/login` | Iniciar sesión (devuelve el token JWT) |
| GET | `/api/Auth/me` | Datos del usuario (requiere token) |
| POST | `/api/Auth/recover` · `/api/Auth/reset` | Recuperar contraseña |
| POST | `/api/Orders` | Crear pedido desde el carrito |
| GET | `/api/Orders/mine` | Pedidos del usuario (requiere token) |
