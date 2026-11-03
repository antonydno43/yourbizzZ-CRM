# YourBizz - SaaS CRM & Website Builder

![YourBizz Logo](public/logo.svg)

**YourBizz** is a comprehensive SaaS platform that combines a powerful drag-and-drop website builder with CRM, booking, forms, e-commerce, and inventory management capabilities. Built with Next.js, Supabase, and Resend, it provides a complete business solution similar to Zoho's suite of products.

## Features

### 🎨 Website Builder
- **Drag-and-Drop Canvas**: Intuitive interface for building websites without coding
- **Element Library**: Headings, paragraphs, buttons, images, containers, dividers, lists, and links
- **Custom Styling**: Full control over typography, colors, backgrounds, borders, and spacing
- **Responsive Design**: Build websites that look great on all devices
- **Layers Panel**: Organize and manage elements with z-index control
- **History/Undo**: Full undo/redo functionality with history tracking

### 👥 CRM Module
- **Contacts Management**: Track leads, contacts, and customers
- **Companies**: Manage company information and relationships
- **Deals Pipeline**: Visual pipeline management with customizable stages
- **Activities & Tasks**: Track calls, meetings, emails, and follow-ups
- **Custom Fields**: Add custom data fields to contacts, companies, and deals
- **Lead Scoring**: Prioritize leads based on engagement

### 📅 Booking System
- **Service Management**: Create and manage bookable services
- **Staff/Provider Management**: Manage team members and their availability
- **Appointment Scheduling**: Easy scheduling with calendar integration
- **Availability Calendar**: Set working hours and blackout dates
- **Automated Reminders**: Send email reminders for upcoming appointments

### 📝 Forms Builder
- **Drag-and-Drop Form Builder**: Create custom forms with various field types
- **Form Types**: Contact forms, lead forms, surveys, registration forms
- **Email Notifications**: Get notified when forms are submitted
- **Submission Management**: View and manage form submissions
- **Embed Anywhere**: Embed forms on your website or share via link

### 🛒 E-commerce
- **Product Catalog**: Manage products with categories, images, and variants
- **Shopping Cart**: Full shopping cart functionality
- **Checkout Process**: Secure checkout with multiple payment options
- **Order Management**: Track orders from creation to delivery
- **Discounts & Coupons**: Create and manage promotional offers
- **Shipping Methods**: Configure shipping options and rates

### 📦 Inventory Management
- **Stock Tracking**: Monitor inventory levels in real-time
- **Multi-Location**: Manage inventory across multiple locations
- **Barcode Support**: Scan and track products with barcodes
- **Low Stock Alerts**: Get notified when stock is running low
- **Purchase Orders**: Create and track purchase orders
- **Supplier Management**: Manage vendor relationships

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **React Query**: Server state management

### Backend
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Supabase Auth**: Authentication with email, Google, and more
- **Supabase Storage**: File storage for images and assets

### Email
- **Resend**: Email service for transactional emails
- **Custom SMTP**: Support for custom email providers

### Deployment
- **Vercel**: Hosting and deployment
- **GitHub**: Version control and CI/CD

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account (optional)
- GitHub account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/antonydno43/yourbizz-crm.git
   cd yourbizz-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with the variables from `.env.local.example`

4. **Set up Supabase**:
   - Create a new project in Supabase
   - Run the SQL migrations from `src/db/migrations/`
   - Enable Row-Level Security (RLS) on all tables

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Visit `http://localhost:3000`

## Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Import your GitHub repository in Vercel
   - Add environment variables
   - Deploy!

## License

Proprietary Software - All Rights Reserved

© 2024 YourBizz
