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
- **[react-pdf](https://react-pdf.org)** - PDF viewing
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
- ✅ Upload documents (CV, cover letter, etc.)
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
- ✅ Update application status (pending, reviewing, accepted, rejected)
- ✅ Access admin dashboard
- ✅ View user management panel
- ✅ Manage user roles and permissions
- ✅ Generate reports and analytics
- ✅ Configure system settings

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
   - JWT token verification
   - Role-based endpoint access control
   - Secure data filtering by user role

3. **Database Security**
   - Row-Level Security (RLS) with Supabase
   - User can only view/modify their own data
   - Admins have elevated database permissions
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

Create the following tables in your Supabase database:

#### Users Table

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Jobs Table

```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(100), -- full-time, part-time, contract, etc.
  salary_min NUMERIC(12, 2),
  salary_max NUMERIC(12, 2),
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  status VARCHAR(50) DEFAULT 'open' NOT NULL, -- open, closed, archived
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
```

#### Applications Table

```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, reviewing, accepted, rejected
  cover_letter TEXT,
  resume_url TEXT,
  additional_documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, user_id) -- Prevent duplicate applications
);

-- Create indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
```

### 🔐 Row Level Security (RLS)

Enable Row Level Security to protect your data:

#### Enable RLS on Tables

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

#### Users Table Policies

```sql
-- Users can view their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

#### Jobs Table Policies

```sql
-- Everyone can view open jobs
CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  USING (status = 'open');

-- Admins can manage all jobs
CREATE POLICY "Admins can manage jobs"
  ON jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

#### Applications Table Policies

```sql
-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (user_id = auth.uid());

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update all applications
CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

### 📦 Storage Setup

Configure Supabase Storage for file uploads (resumes, documents):

#### 1. Create Storage Bucket

```sql
-- Create a bucket for application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('applications', 'applications', false);
```

#### 2. Set Storage Policies

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'applications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own files
CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'applications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to view all files
CREATE POLICY "Admins can view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'applications' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

### 🔌 Supabase Client Configuration

The Supabase client is configured in `src/lib/superbase/` directory:

```typescript
// src/lib/superbase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 🚀 Using Supabase in the Application

#### Authentication Example

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Register
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe'
    }
  }
})

// Logout
await supabase.auth.signOut()
```

#### Database Operations

```typescript
// Fetch jobs
const { data: jobs, error } = await supabase
  .from('jobs')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })

// Create application
const { data, error } = await supabase
  .from('applications')
  .insert({
    job_id: jobId,
    user_id: userId,
    cover_letter: coverLetter,
    resume_url: resumeUrl
  })

// Update application status
const { data, error } = await supabase
  .from('applications')
  .update({ status: 'accepted' })
  .eq('id', applicationId)
```

#### File Upload Example

```typescript
// Upload resume
const file = event.target.files[0]
const fileName = `${userId}/${Date.now()}_${file.name}`

const { data, error } = await supabase.storage
  .from('applications')
  .upload(fileName, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('applications')
  .getPublicUrl(fileName)
```

### 🔄 Real-time Subscriptions (Optional)

Enable real-time updates for live notifications:

```typescript
// Subscribe to new applications
const subscription = supabase
  .channel('applications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'applications'
    },
    (payload) => {
      console.log('New application:', payload.new)
    }
  )
  .subscribe()

// Unsubscribe when done
subscription.unsubscribe()
```

### 📊 Database Functions (Optional)

Create useful database functions:

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 🛠️ Useful Supabase CLI Commands

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate TypeScript types from your database
supabase gen types typescript --linked > src/types/database.ts

# Run migrations
supabase db push

# Reset database (local development)
supabase db reset
```

### 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

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
   - Use search and filters to find relevant positions
   - Click on any job card to view more details

4. **Apply for Jobs**
   - Click on a job to view full details
   - Click the "Apply" button
   - Fill in the application form with required information
   - Upload required documents (CV, cover letter, etc.)
   - Review your application
   - Submit your application

5. **Track Applications**
   - View your application status in your dashboard
   - Check for updates on your submitted applications
   - Receive notifications about application progress

### For Administrators

1. **Login**
   - Use admin credentials (`admin@mail.com` / `password123`) to access admin features
   - Access additional admin-only menu options

2. **Manage Jobs**
   - Create new job postings with detailed information
   - Edit existing job listings
   - Update job status (open/closed)
   - Archive or delete jobs

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

### Tips for Best Experience

- **Keep Profile Updated**: Ensure your profile information is current
- **Upload Quality Documents**: Use PDF format for professional documents
- **Check Regularly**: Visit the platform regularly for new job postings
- **Follow Instructions**: Read job descriptions carefully before applying
- **Be Responsive**: Check your email for notifications and updates

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

## 📧 Contact

For questions or support, please contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
