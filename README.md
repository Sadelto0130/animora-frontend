# Animora
Animora conecta amantes de los animales: denuncia maltrato, adopta, comparte consejos y haz crecer la comunidad pet-friendly.

Frontend de **Animora**, una plataforma comunitaria para la protección animal.  
Permite a los usuarios denunciar casos de maltrato, leer artículos de cuidado, explorar adopciones y conectarse con la comunidad.

## 🚀 Stack
- React (Vite o CRA)
- React Router DOM
- Context API (o Redux si se escala)
- TailwindCSS / Shadcn UI
- Axios para consumo de API
- EditorJS (para publicaciones)

Funcionalidades

- Denuncias: formulario + listado público/privado.
- Blog de artículos de cuidado.
- Listado de adopciones con filtros.
- Perfiles de mascotas y usuarios.
- Autenticación con JWT.
- Notificaciones amigables con react-hot-toast.

## 🔧 Instalación
```bash
# clonar
git clone https://github.com/tu-usuario/animora-frontend.git
cd animora-frontend

# instalar dependencias
npm install

# configurar variables de entorno
cp .env.example .env   # API_URL=http://localhost:4000

# iniciar en modo desarrollo
npm run dev

Estructura
src
 ┣ api 
 ┣ common
 ┣ components
 ┣ context
 ┣ imgs
 ┣ libs
 ┣ pages
 ┣ ui
 ┣ App.jsx
 ┣ index.css
 ┣ main.jsx
 ┗ regex.txt
