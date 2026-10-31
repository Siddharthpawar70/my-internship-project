<<<<<<< HEAD
# StayAura Hotel Booking

## Run locally

Install MySQL Server and create a database and application user:

```sql
CREATE DATABASE hotelbooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hotelbooking_app'@'localhost' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, REFERENCES ON hotelbooking.* TO 'hotelbooking_app'@'localhost';
```

Copy `.env.example` to `.env` and set the MySQL credentials. Install dependencies with `npm install`, then start the application with `npm run dev`. The Express API and Vite frontend share `http://localhost:3000`. On startup, the API verifies the MySQL connection, creates its tables, and seeds hotels, rooms, add-ons, and coupons from `src/data/mockData.ts` when those tables are empty. In development only, the frontend still starts if MySQL is unavailable; API-backed features return a 503 response until MySQL is started and the server is restarted. Production startup still requires MySQL.

The previous local database at `.data/hotelbooking.sqlite` is no longer used and is not migrated automatically. Back it up before removing it; existing accounts, sessions, and bookings need to be migrated separately if they must be retained.

Run `npm run lint` for the TypeScript check and `npm run build` for a production frontend build. For production, build first, then start with `NODE_ENV=production npm start`; the server serves `dist` and the API from the same origin. Set `PORT` to change the listening port and use `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` to configure MySQL. Keep database backups in your MySQL deployment process.

## Implemented server flows

- Email/password account registration and login with scrypt password hashes and HTTP-only session cookies.
- Profile updates and owner-scoped reservation access.
- Server-priced reservations with date, room-capacity, inventory, coupon, and add-on validation.
- Persistent reservation cancellation, rescheduling, check-in, and check-out actions.
- Reservation records persist in MySQL after the server restarts.

## Integrations and remaining work

Online card, UPI, and net-banking payments are not configured. Those methods create reservations with a `Pending` payment status; card data is not collected. Add a payment provider and implement its server-side order creation, signed webhook verification, refunds, and idempotency before accepting online payments. Email delivery, password recovery, social/SSO login, and SMS verification also require provider credentials and are not enabled.

The hotel catalog and initial room inventory are seeded demo content. Wishlist, reviews, notifications, and much of the hotel-admin configuration still use browser state or mock data and are not yet multi-user database-backed. Use a managed MySQL service and deployment-specific session/security configuration for production.
=======
# my-internship-project
>>>>>>> db7b07ad622ef0b50a100fc7363c899cdf756622
