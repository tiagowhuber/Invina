# Invina - Event Ticketing Platform Frontend

A modern, mobile-first event ticketing platform built with Vue 3, TypeScript, Tailwind CSS, and shadcn-vue components.

## 🚀 Features

### Public Features
- **Event Browsing**: Browse available events with real-time capacity information
- **Event Details**: View detailed event information with availability
- **Shopping Cart**: Add multiple tickets to cart with attendee name customization
- **Checkout**: Secure checkout process with customer information
- **WebPay Integration**: Full payment flow with WebPay Plus (Chilean payment gateway)
- **Order Management**: 
  - Track orders by order number or email
  - 15-minute order expiration countdown for pending payments
  - QR code generation for confirmed tickets
- **Ticket Validation**: View ticket details with QR codes for venue entry

### Admin Features (Password: `admin123`)
- **Event Management**: Full CRUD operations for events
- **Orders Dashboard**: View all orders with status tracking and revenue metrics
- **Ticket Validation**: Scan and validate tickets at venue entry
- **Statistics & Reports**: 
  - Payment statistics (approved, pending, rejected, total revenue)
  - Event-specific statistics (tickets sold, capacity, revenue)
  - Ticket status breakdown

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official routing library
- **Pinia** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-vue** - Re-usable component library
- **Axios** - HTTP client
- **qrcode.vue** - QR code generation

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file with backend API URL
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🎯 Key Features

### Mobile-First Design
All pages are built with Tailwind's mobile-first approach, ensuring excellent UX on all devices.

### Order Expiration
Orders have a 15-minute expiration window. The countdown timer is displayed on pending orders.

### QR Code Integration
Confirmed tickets display QR codes that can be scanned at venue entry for validation.

### Admin Authentication
Simple password-based authentication (password: `admin123`) with session storage.

### WebPay Payment Flow
1. User creates order → Status: `pending`
2. System initiates WebPay transaction
3. User redirects to WebPay external page
4. After payment, WebPay redirects back
5. Order status updates to `paid`, tickets become `confirmed`

## 🔗 API Integration

The frontend integrates with the backend API at `http://localhost:3000/api`

## 🔐 Admin Access

Navigate to `/admin/login` and use password `admin123` to access:
- Event management
- Orders dashboard
- Ticket validation
- Statistics

## 📝 Routes

**Public Routes:**
- `/` - Events list
- `/events/:id` - Event detail
- `/checkout` - Checkout
- `/payment` - Payment redirect
- `/orders/:orderNumber` - Order confirmation
- `/orders/lookup` - Order lookup
- `/tickets/:ticketNumber` - Ticket detail

**Admin Routes:**
- `/admin` - Event management
- `/admin/orders` - Orders dashboard
- `/admin/validate` - Ticket validation
- `/admin/statistics` - Statistics

## 📄 License

Copyright © 2025 Invina
