# Aurex Store

Ecommerce del Taller 3: **Angular → API ASP.NET Core → Entity Framework → MySQL**.

| Carpeta | Contenido |
|---|---|
| `frontend/` | Proyecto Angular 20 (abrir en VS Code) |
| `api/Taller3_Ecommerce_API/` | API .NET 10 + EF Core + Pomelo MySQL (abrir el `.csproj` en Visual Studio) |
| `database/taller3_ecommerce.sql` | Script que crea la base, la tabla `products` y los productos |
| `aurex-store.html` | Versión estática de demostración (doble clic para abrir) |

## Cómo ejecutarlo

1. **MySQL**: abre MySQL Workbench, abre `database/taller3_ecommerce.sql` y ejecútalo (rayo ⚡).
2. **API**: abre `api/Taller3_Ecommerce_API/Taller3_Ecommerce_API.csproj` en Visual Studio, perfil **http**, ejecutar.
   Comprueba http://localhost:5000/api/Products
3. **Angular**: en VS Code abre la carpeta `frontend/` y en la terminal:
   ```
   npm install --legacy-peer-deps
   npm start
   ```
   Abre http://localhost:4200
4. **Login**: en http://localhost:4200 pulsa *Ingresar → Regístrate*, crea tu cuenta y quedarás con la sesión iniciada (token JWT). Crear, editar o borrar productos en la API exige estar autenticado.
