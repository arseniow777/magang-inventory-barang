# Inventory Barang Management System

A comprehensive inventory management application built with PERN stack (PostgreSQL, Express.js, React, Node.js).

## Tech Stack

### Backend
- **Node.js** v18+ with Express.js v5
- **PostgreSQL** v14+ 
- **Prisma ORM** v6 - Database ORM and Migration tool
- **Multer** v2 - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

### Frontend
- **React** v19 with Vite v7
- **TailwindCSS** v4 - Utility-first CSS framework
- **TanStack Query** v5 - Data fetching and caching library
- **React Router DOM** v7 - Client-side routing
- **Axios** v1 - HTTP client

---

## Prerequisites

The following software must be installed on your system before proceeding:

- **Node.js** version 18.x or higher - [Download](https://nodejs.org/)
- **npm** version 8.x or higher (included with Node.js)
- **PostgreSQL** version 14.x or higher - [Download](https://www.postgresql.org/download/)
- **Git** version control system - [Download](https://git-scm.com/downloads)

Verify installation by running these commands:

```bash
node -v
npm -v
psql --version
git --version
```

---

## Installation Guide

### Step 1: Clone Repository

```bash
git clone <REPOSITORY-URL>
cd inventory_barang
```

### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_barang?schema=public"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `username` and `password` with your PostgreSQL credentials.

### Step 4: Database Creation

Create the PostgreSQL database using one of the following methods:

**Method 1: Command Line**
```bash
createdb inventory_barang
```

**Method 2: PostgreSQL CLI**
```bash
psql -U postgres
CREATE DATABASE inventory_barang;
\q
```

**Method 3: pgAdmin4 (GUI)**
- Open pgAdmin4
- Create a new database named `inventory_barang`

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

### Step 6: Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

The frontend `.env` file is already configured with default values:

```env
VITE_API_URL=http://localhost:5000/api
```

No changes are required unless you modify the backend port.

---

## Running the Application

### Development Environment

Two separate terminal windows are required to run both backend and frontend servers.

**Terminal 1 - Backend Server:**

```bash
cd backend
npm run dev
```

Expected output:
```
Backend server running on http://localhost:5000
Environment: development
```

**Terminal 2 - Frontend Server:**

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v7.x.x ready in xxx ms
Local: http://localhost:5173/
```

### Application Access

Once both servers are running, access the application through:

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check Endpoint:** http://localhost:5000/api/health

A successful setup will display a green connection status on the frontend homepage.

---

## Project Structure

```
inventory_barang/
├── backend/
│   ├── node_modules/         # Dependencies (auto-generated)
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema definition
│   │   └── seed.js           # Database seeding script
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API route definitions
│   │   └── index.js          # Application entry point
│   ├── uploads/              # File upload directory
│   ├── .env                  # Environment variables (excluded from git)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── node_modules/         # Dependencies (auto-generated)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              
│   │   │   └── axios.js      # Axios instance configuration
│   │   ├── assets/           # Images, icons, and media files
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Root application component
│   │   ├── Router.jsx        # Route configuration
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles with Tailwind imports
│   ├── .env                  # Environment variables (excluded from git)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite build configuration
│
├── .gitignore
└── README.md
```

---

## Database Management

### Prisma Schema

The database schema is defined in `backend/prisma/schema.prisma`. This file contains model definitions that map to database tables.

Example model structure:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migration Workflow

After modifying the Prisma schema, apply changes to the database:

```bash
cd backend

# Create and apply migration
npx prisma migrate dev --name migration_description

# Regenerate Prisma Client
npx prisma generate
```

### Prisma Commands Reference

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with initial data
npx prisma db seed

# Pull schema from existing database
npx prisma db pull

# Push schema changes without migration
npx prisma db push
```

---

## Development Workflow

### Creating New Features

**Backend Development:**

1. Update `prisma/schema.prisma` if database changes are required
2. Run migration: `npx prisma migrate dev`
3. Create controller in `src/controllers/`
4. Define routes in `src/routes/`
5. Register routes in `src/index.js`

**Frontend Development:**

1. Create reusable components in `src/components/`
2. Build page components in `src/pages/`
3. Add routes in `src/Router.jsx`
4. Implement API integration using TanStack Query

### Independent Development

**Frontend Developers:**
- Can work without running the backend server
- Use mock data during development
- Focus on UI/UX implementation

**Backend Developers:**
- Can work without running the frontend server
- Test APIs using tools like Postman, Insomnia, or curl
- Focus on business logic and database operations

### Integration Testing

- Run both backend and frontend servers simultaneously
- Test API connectivity and data flow
- Identify and resolve integration issues
- Commit and push completed features

---

## Available Scripts

### Backend Scripts

```bash
npm run dev              # Start development server with auto-reload
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio database GUI
npm run prisma:seed      # Seed database with initial data
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint code linter
```

---

## Troubleshooting

### Port Already in Use

**Backend (Port 5000):**

macOS/Linux:
```bash
lsof -ti:5000 | xargs kill -9
```

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**

macOS/Linux:
```bash
lsof -ti:5173 | xargs kill -9
```

Windows:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Connection Errors

1. Verify PostgreSQL service is running
2. Check credentials in `backend/.env`
3. Confirm database `inventory_barang` exists
4. Test connection: `psql -U username -d inventory_barang`

### Prisma Client Not Found

```bash
cd backend
npx prisma generate
```

### Module Not Found Errors

```bash
# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Configuration Issues

1. Verify backend server is running
2. Check `CORS_ORIGIN` value in `backend/.env`
3. Ensure frontend runs on the correct port (5173)
4. Restart both servers

---

## Git Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Add: feature description"

# Push to remote repository
git push origin feature/feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

```
Add: new feature implementation
Update: modify existing feature
Fix: bug fixes
Remove: delete files or code
Refactor: code restructuring without functionality changes
Docs: documentation updates
Style: formatting and style changes
Test: add or update tests
```

---

## Documentation Resources

### Prisma
- [Official Documentation](https://www.prisma.io/docs)
- [CRUD Operations Guide](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [Schema Reference](https://www.prisma.io/docs/orm/prisma-schema)

### React and Vite
- [React Documentation](https://react.dev/)
- [Vite Configuration Guide](https://vitejs.dev/guide/)

### TailwindCSS
- [Official Documentation](https://tailwindcss.com/docs)
- [Utility Classes Reference](https://tailwindcss.com/docs/utility-first)

### TanStack Query
- [React Query Documentation](https://tanstack.com/query/latest)
- [Quick Start Guide](https://tanstack.com/query/latest/docs/framework/react/quick-start)

### Express.js
- [Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Middleware Documentation](https://expressjs.com/en/guide/using-middleware.html)

---

## Support

For questions or issues:

1. Create an issue in this GitHub repository
2. Consult the documentation provided above
3. Contact the development team

---

## License

ISC

---

## Setup Verification Checklist

Use this checklist to verify successful installation:

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Repository cloned successfully
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend `.env` file configured
- [ ] PostgreSQL database created
- [ ] Prisma Client generated
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Frontend displays green connection status
- [ ] Health check endpoint responds correctly

If all items are checked, the setup is complete and the application is ready for development.

---

**Documentation Version:** 1.0  
**Last Updated:** February 2026
