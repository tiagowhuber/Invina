# Invina Frontend

Vue 3 frontend for a wine tour booking system. Handles the booking flow from tour selection through WebPay payment and ticket generation. Built for a Chilean winery offering guided tours with wine pairings.

## What This Does

Wine tour operators need online booking with real payment processing, not just contact forms. This handles the full customer journey: browse available tour dates, book tickets with seat reservations, pay via WebPay Plus (Chile's standard gateway), and receive QR-coded tickets. Also includes basic admin tools for managing tours and validating tickets at the door.

## Architecture

Standard SPA talking to a REST backend. State management via Pinia stores for tours, shopping cart, and payment flows. The payment flow redirects to WebPay's hosted page and handles the callback on return. Orders expire after 15 minutes if unpaid. QR codes are generated client-side from confirmed ticket numbers.

Uses shadcn-vue components on top of Tailwind for the UI. Not trying to reinvent standard patterns here.

## Dependencies

- Backend: `Invina-ts-api` (must be running on localhost:3000 or configured URL)
- Payment: WebPay Plus integration (via backend)
- Email: Resend (backend sends confirmations)

## Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS + shadcn-vue components
- Axios
- qrcode.vue

## Local Setup

Prerequisites:
- Node.js 18+
- Backend API running at `http://localhost:3000` (see Invina-ts-api)

```bash
npm install

# Create .env
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

npm run dev
# Opens at http://localhost:5173
```

For production build:
```bash
npm run build  # Outputs to dist/
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

That's it. One variable.

## How It Works

**Customer Flow:**
1. Browse tours, see available dates with real capacity counts
2. Add tickets to cart (multiple tour dates supported)
3. Enter customer info and attendee names at checkout
4. Create order (status: `pending`, 15-min expiration timer starts)
5. Redirect to WebPay hosted payment page
6. WebPay redirects back with transaction result
7. Backend updates order to `paid`, tickets become `confirmed` with QR codes

**Admin:**
- Password-protected pages (session storage, password: `admin123`)
- Create/edit/delete tours with date-specific pricing
- View orders with payment status filtering
- Scan QR codes to validate tickets
- Basic revenue stats per tour

The 15-minute expiration keeps held seats from blocking availability. Orders auto-expire via backend job.

Mobile-first styling because most bookings happen on phones.

## Project Layout

```
src/
  views/          - Page components
  components/ui/  - shadcn-vue components
  stores/         - Pinia stores (tours, bookings, payment)
  services/api/   - Axios client wrappers
  router/         - Route definitions
  layouts/        - PublicLayout, AdminLayout wrappers
  types/          - TypeScript interfaces
public/images/    - Tour and wine images
```

Key files:
- [src/stores/tours.ts](src/stores/tours.ts) - Tour data fetching and caching
- [src/stores/bookings.ts](src/stores/bookings.ts) - Shopping cart state
- [src/stores/payment.ts](src/stores/payment.ts) - WebPay flow orchestration
- [src/router/index.ts](src/router/index.ts) - Routes and auth guard for admin

## Deployment

Configured for Netlify with SPA redirects (`public/_redirects`).

Build settings:
- Command: `npm run build`
- Directory: `dist`
- Env: `VITE_API_BASE_URL=<production-api-url>`

WebPay callbacks need the production domain whitelisted in Transbank's dashboard.

## Routes

**Public:**
- `/` - Tour listing
- `/events/:id` - Tour detail + booking form
- `/checkout` - Cart and customer info
- `/payment` - WebPay redirect handler
- `/orders/:orderNumber` - Order status with tickets
- `/orders/lookup` - Find order by email
- `/tickets/:ticketNumber` - Individual ticket QR

**Admin** (require password auth):
- `/admin` - Tour CRUD
- `/admin/orders` - Order dashboard
- `/admin/validate` - QR scanner
- `/admin/statistics` - Revenue stats

## Common Issues

**API Connection Fails:**  
Backend isn't running or wrong URL in `.env`. Check `http://localhost:3000/api/tours` returns data.

**Orders Not Expiring:**  
Backend expiration job isn't running. Timer is UI-only; actual expiration happens server-side.

**Admin Won't Login:**  
Clear localStorage/sessionStorage. Password is literally `admin123` (yes, hardcoded).

**Missing Tour Images:**  
Images must exist at `public/images/tours/{tourSlug}/` with correct filenames referenced in tour data.

**Build Type Errors:**  
Run `npm run type-check`. Usually means types in `src/types/index.ts` don't match backend API response structure.

## Known Limitations

- Admin auth unfinished.
- No actual QR scanning implementation on admin side—just displays codes. Would need camera access + library.
- Order expiration countdown continues even after backend expires the order. Should poll status.
- No retry logic on failed API calls. Network blips just error out.
- Images are served from `public/` instead of CDN. Slow on poor connections.
- No loading skeletons, just spinners. Could be better.
- TypeScript is strict but not exhaustive—some `any` types remain in payment flow.
- Mobile layout works but wasn't tested extensively on tablets.

## License

Copyright © 2026 Invina

---

Last updated: February 2026
