# 🚀 Hiring Management System

A modern hiring management application built with Next.js 15, featuring job listing, application tracking, and user authentication with role-based access control.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Supabase Integration](#️-supabase-integration)
- [Available Scripts](#-available-scripts)
- [Test Credentials](#-test-credentials)
- [User Starter Guide](#-user-starter-guide)
- [License](#-license)

## 🛠 Tech Stack

### Core Framework
- **[Next.js 15.5.2](https://nextjs.org)** - React framework with App Router
- **[React 19.1.0](https://react.dev)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org)** - Type-safe JavaScript

### UI Components & Styling
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com)** - Accessible component primitives
- **[Lucide React](https://lucide.dev)** - Icon library
- **[class-variance-authority](https://cva.style/docs)** - Component variants
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### State Management & Data Fetching
- **[TanStack Query v5](https://tanstack.com/query/latest)** - Async state management
- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com)** - Form management
- **[Zod](https://zod.dev)** - Schema validation

### Authentication & Backend
- **[NextAuth.js v4](https://next-auth.js.org)** - Authentication
- **[Supabase](https://supabase.com)** - Backend as a Service
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Additional Features
- **[MediaPipe](https://developers.google.com/mediapipe)** - Hand gesture detection
- **[Axios](https://axios-http.com)** - HTTP client
- **[date-fns](https://date-fns.org)** - Date utilities
- **[Sonner](https://sonner.emilkowal.ski)** - Toast notifications

### Development Tools
- **[ESLint](https://eslint.org)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler

## ✨ Features

- 🔐 **Authentication** - Secure login/register with NextAuth.js
- 👥 **Role-Based Access Control** - Admin and User roles with different permissions
- 🗄️ **Supabase Backend** - Powerful BaaS with PostgreSQL database, real-time subscriptions, and file storage
- 🔒 **Row Level Security** - Database-level security policies ensuring data privacy and access control
- 💼 **Job Management** - Browse and search available job listings
- 📝 **Application System** - Apply for jobs with document upload
- 📁 **Cloud Storage** - Secure file storage and management with Supabase Storage
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Radix UI components
- 📊 **State Management** - Efficient data handling with TanStack Query and Zustand
- 🔍 **Form Validation** - Type-safe forms with React Hook Form and Zod
- 🎯 **Hand Gesture Detection** - Innovative interaction using MediaPipe
- ⚡ **Real-time Updates** - Live notifications and data synchronization with Supabase real-time

## 👥 Role-Based Access Control (RBAC)

This application implements a comprehensive Role-Based Access Control system to manage user permissions and ensure secure access to different features based on user roles.

### 🎭 Available Roles

#### 1. **User (Applicant)** 
Standard role for job seekers and applicants.

**Permissions:**
- ✅ View public job listings
- ✅ Search and filter available jobs
- ✅ View detailed job descriptions
- ✅ Submit job applications
- ✅ Upload documents (CV, cover letter, etc.) - components are available but not yet implemented
- ✅ Track own application status
- ✅ Update personal profile
- ✅ Manage personal account settings
- ❌ Cannot create or modify job postings
- ❌ Cannot view other users' applications
- ❌ Cannot access admin dashboard

#### 2. **Admin (Recruiter/HR)**
Elevated role with full system access for managing the hiring process.

**Permissions:**
- ✅ All User permissions
- ✅ Create new job postings
- ✅ Edit existing job listings
- ✅ Delete or archive jobs
- ✅ View all submitted applications
- ✅ Filter and search applications
- ✅ Review applicant documents
- ✅ Access admin dashboard

### 🔒 RBAC Implementation

#### Middleware Protection
The application uses Next.js middleware (`src/middleware.ts`) to protect routes:

```typescript
// Protected routes automatically checked
- /job-list/* - Requires authentication
- /apply/* - Requires User or Admin role
- /admin/* - Requires Admin role only
- /dashboard/* - Role-specific dashboards

// Public routes
- /login
- /register
- /api/auth/*
```

#### Higher-Order Component (HOC)
Role-based component rendering using `withRoleAccess` HOC:

```typescript
// Located in: src/components/hoc/withRoleAccess.tsx
// Usage: Wrap components to restrict access by role

// Example:
const AdminOnlyComponent = withRoleAccess(
  MyComponent, 
  ['admin']
);
```

#### Session Management
- **NextAuth.js** manages user sessions and role information
- User role stored in JWT token and session object
- Automatic session validation on each protected request
- Secure token refresh and expiration handling

#### Component-Level Protection
Components check user roles before rendering:

```typescript
// Conditional rendering based on role
{session?.user?.role === 'admin' && (
  <AdminControls />
)}

// Hook-based role checking
const { isAdmin, isUser } = useAuth();
```

### 🛡️ Security Features

1. **Route Guards**
   - Middleware intercepts all requests
   - Validates authentication tokens
   - Checks user roles before granting access
   - Redirects unauthorized users to login

2. **API Protection**
   - Server-side role validation on API routes
   - JWT token verification - Next Auth side, backend not ready
   - Role-based endpoint access control
   - Secure data filtering by user role

3. **Database Security**
   - Row-Level Security (RLS) with Supabase
   - User can only view/modify their own data
   - Encrypted sensitive data storage

4. **Frontend Protection**
   - UI elements hidden based on role
   - Client-side validation as first layer
   - Server-side validation as enforcement layer
   - XSS and CSRF protection

### 📊 Role Assignment

**Default Assignment:**
- New registrations automatically receive **User** role
- Admin roles must be manually assigned in the database

**Manual Role Assignment:**
```sql
-- Update user role in Supabase
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

**Programmatic Assignment:**
- Admins can promote users through the admin dashboard
- Role changes require admin authentication
- Audit log tracks all role modifications

### 🔄 Role Flow Diagram

```
Registration → User Role (Default)
                    ↓
              Login Success
                    ↓
         ┌──────────┴──────────┐
         ↓                     ↓
    User Dashboard      Admin Dashboard
         ↓                     ↓
   View Jobs              Manage Jobs
   Apply Jobs          Review Applications
   Track Status         User Management
```

### 🧪 Testing Different Roles

Use the provided test credentials to experience different role capabilities:

**Test as User:**
```
Email: user@mail.com
Password: Password123!
- Access limited to applicant features
```

**Test as Admin:**
```
Email: admin@mail.com
Password: password123
- Full system access and management tools
```

## 📁 Project Structure

```
hiring_management/
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   └── ...
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/            # API routes
│   │   │   ├── apply/
│   │   │   ├── auth/
│   │   │   └── jobs/
│   │   ├── apply/          # Job application pages
│   │   ├── job-list/       # Job listing pages
│   │   └── ...             # Other app pages
│   ├── assets/             # Project assets
│   │   ├── icon/           # Icon components
│   │   ├── images/         # Image files
│   │   └── styles/         # Global styles
│   ├── components/         # React components
│   │   ├── atoms/          # Basic UI components
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex components
│   │   ├── templates/      # Page templates
│   │   └── hoc/            # Higher-order components
│   ├── enums/              # TypeScript enums
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces
│   ├── lib/                # Libraries and utilities
│   │   ├── schema/         # Zod schemas
│   │   └── superbase/      # Supabase configuration
│   ├── services/           # API services
│   │   ├── api/            # API calls
│   │   ├── configs/        # Service configurations
│   │   ├── mutation/       # TanStack Query mutations
│   │   └── query/          # TanStack Query queries
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── middleware.ts       # Next.js middleware
├── components.json         # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mahmadakbar/hiring_management.git
cd hiring_management
```

2. **Install dependencies**

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

## ⚙️ Environment Setup

1. **Create environment file**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

2. **Configure environment variables**

Add the following environment variables to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# API Configuration (if applicable)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> **Note:** Replace the placeholder values with your actual credentials.

3. **Set up Supabase**

- Create a Supabase project at [supabase.com](https://supabase.com)
- Set up your database tables
- Copy your project URL and API keys to the `.env.local` file

## 🗄️ Supabase Integration

This application uses **Supabase** as the Backend-as-a-Service (BaaS) platform, providing authentication, database, and storage capabilities.

### 📋 Setting Up Supabase

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - **Name**: hiring_management
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Wait for the project to be provisioned (usually takes 1-2 minutes)

#### 2. Get Your API Keys

1. Navigate to **Settings** → **API** in your Supabase dashboard
2. Copy the following credentials:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 🗃️ Database Schema




## 📜 Available Scripts

### Development

```bash
# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Code Quality

```bash
# Run ESLint and auto-fix issues
npm run lint

# Check for linting errors without fixing
npm run lint:check

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Type checking
npm run type-check
```

## 🔑 Test Credentials

Use these credentials to test different user roles:

### Admin Account
- **Email:** `admin@mail.com`
- **Password:** `password123`

### User Account
- **Email:** `user@mail.com`
- **Password:** `Password123!`

## 👤 User Starter Guide

### For Users (Applicants)

1. **Registration**
   - Navigate to the registration page at `/register`
   - Fill in your details (name, email, password)
   - Ensure password meets requirements
   - Complete the registration process

2. **Login**
   - Go to `/login` page
   - Use your email and password to log in
   - Or use the test user credentials above

3. **Browse Jobs**
   - View available job listings on the job list page
   - Click on any job card to view more details

4. **Apply for Jobs**
   - Click on a job to view full details
   - Click the "Apply" button
   - Fill in the application form with required information
   - Review your application
   - Submit your application

5. **Track Applications**
   - View your application status in your dashboard
   - Check for updates on your submitted applications

### For Administrators

1. **Login**
   - Use admin credentials (`admin@mail.com` / `password123`) to access admin features
   - Access additional admin-only menu options

2. **Manage Jobs**
   - Create new job postings with detailed information
   - Edit existing job listings
   - Update job status (open/closed)
   - Archive or inactive jobs

3. **Review Applications**
   - View all submitted applications across all jobs
   - Filter applications by job, status, or date
   - Review applicant details and uploaded documents
   - Update application statuses (pending, reviewing, accepted, rejected)
   - Contact applicants directly

4. **User Management**
   - View registered users and their information
   - Manage user permissions and roles
   - Monitor user activity

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Module Not Found**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Run type check to identify TypeScript errors
npm run type-check

# Check for linting issues
npm run lint:check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and modern web technologies.
