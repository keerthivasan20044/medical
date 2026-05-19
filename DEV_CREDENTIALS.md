# Development Credentials (MediPharm)

> [!WARNING]
> This file contains sensitive test credentials. Do NOT commit this to public repositories.

## Test Accounts
| Role | Email | Password | Phone |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@test.com` | `test1234` | `9876543210` |
| **Pharmacist** | `pharmacist@test.com` | `test1234` | `9876543211` |
| **Delivery** | `delivery@test.com` | `test1234` | `9876543212` |
| **Admin** | `admin@medipharm.com` | `admin1234` | `9876543213` |

## Database Initialization
To re-seed these users, run:
```bash
cd server
node scripts/seedUsers.js
```

## Note on OTP
In development mode (`NODE_ENV=development`), the default OTP for all login/verification flows is `123456`.
