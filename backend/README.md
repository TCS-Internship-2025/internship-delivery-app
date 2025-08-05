# DHV - Backend

A Spring Boot application for managing domestic parcel delivery operations, featuring user authentication, parcel tracking, address management, and automated email notifications.

### Core Features

- **User Management**: Secure user registration with email verification
- **Authentication**: JWT-based authentication with refresh token rotation
- **Parcel Management**: Complete CRUD operations for parcels with status tracking
- **Address Management**: Flexible address handling with change request workflows
- **Tracking System**: Real-time parcel tracking with detailed status history
- **Email Notifications**: Automated email notifications for key delivery events
- **Location Services**: Predefined pickup and delivery locations
- **API Security**: Dual authentication support (JWT + API Keys)
- **Audit Trail**: Logging and status history tracking

## Technology Stack & Requirements

### Prerequisites
- **Java 21** (Required)
- **Maven 3.9.10+** (Required)
- **Docker & Docker Compose** (For local development)
- **PostgreSQL 17** (Production database)
- **Redis** (Session management and caching)

### Core Technologies

#### Framework & Runtime
- **Spring Boot 3.5.3** - Main application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **Spring Mail** - Email functionality
- **Java 21** - Runtime environment with modern language features

#### Database & Persistence
- **PostgreSQL** - Primary relational database
- **Redis** - Caching and session management
- **Flyway** - Version-controlled database migrations

#### Security & Authentication
- **JWT** - Token-based authentication with RSA key pairs
- **Refresh Tokens** - Automatic token rotation for enhanced security
- **API Key Authentication** - External service integration

#### Build & Development Tools
- **Maven** - Build automation and dependency management
- **Lombok** - Boilerplate code reduction
- **Jakarta Validation** - Comprehensive input validation
- **Docker Compose** - Local development environment

## Development Environment Setup

### 1. Prerequisites Installation

Ensure you have the following installed:
```bash
# Verify Java 21
java -version

# Verify Maven 3.9.10+
mvn -version
```

### 2. Clone and Navigate
```bash
git clone https://github.com/TCS-Internship-2025/internship-delivery-app.git
cd internship-delivery-app/backend
```

### 3. Start Local Services
```bash
# Start all required services (PostgreSQL, Redis, MailHog)
docker compose up -d
```

This command starts:
- **PostgreSQL** on port `5432` (Database: `parcel_db`, User: `postgres`, Password: `<DB_PASSWORD>` set via environment variable)
- **Redis** on port `6379` (Session storage)
- **MailHog** on ports `1025` (SMTP) and `8025` (Web UI for email testing)

### 4. Environment Configuration

#### IntelliJ IDEA
1. Click the 3 dots next to the debug button
2. Select your application run configuration
3. Click "Modify options" → "Environment variables"
4. Add the following variables:
   ```
   DB_PASSWORD=<YOUR_POSTGRES_PASSWORD>
   MAIL_USERNAME=tcsinternshipdeliveryapp@gmail.com
   MAIL_PASSWORD=kxkpultkqqodqqux
   ```

### 5. Build and Run

```bash
# Install dependencies and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

The API will be available at: **http://localhost:8080**

## Database Setup & Migrations

### Database Configuration
The application uses PostgreSQL as the primary database with Flyway for version-controlled migrations.

**Default Configuration:**
- **Host**: `localhost:5432`
- **Database**: `parcel_db` (configurable via `DB_NAME`)
- **User**: `postgres` (configurable via `DB_USER`)
- **Password**: Set via `DB_PASSWORD` environment variable

### Flyway Migrations
Database schema is managed through Flyway migrations located in `src/main/resources/db/migration/`:

```
V1__init.sql                              # Initial schema
V2__refine_schema.sql                     # Schema refinements
V3__recipient_table_addition_schema.sql   # Recipient management
V4__add_refresh_token_table.sql           # JWT refresh tokens
V5__create_api_key_table.sql              # API key authentication
V6__recipient_titles.sql                  # Recipient title fields
V7__on_delete_changes.sql                 # Cascade delete rules
V8__insert_predefined_locations.sql       # Default locations
V9__add_updated_at_to_users.sql           # User audit fields
```

## API Endpoints & Authentication

### Authentication Flow

#### 1. User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "test21",
    "email": "test21@example.com",
    "emailVerified": false
}
```

#### 2. Email Verification
```http
GET /api/auth/verify?uid={user_id}&t={verification_token}
```

#### 3. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "token": "eyJhbGciOiJSUzI1NiJ9.eyJpc3Mi...FCTlIkqFhKZRrzOPV8s-tZ...",
    "refreshToken": "05d24d10-0840-431d-3250-335dc6887f8f"
}
```

#### 4. Token Refresh
```http
POST /api/auth/refresh
Content-Type: application/json

{
    "token": "eyJhbGciOiJSUzI1NiJ9.eyJpc3Mi...QskT91fidCAWfwALAp73hr_pC...",
    "refreshToken": "05d24d10-0840-431d-3250-335dc6887f8f"
}
```

### Core API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /refresh-token` - Token refresh
- `GET email/verify` - Email verification
- `POST /logout` - User logout
- `POST /password/forgot` - Request password reset
- `POST /password/reset` - Reset password
- `POST /resend-verification` - Resend verification email

#### User Management (`/api/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account
- `PUT /change-password` - Change password

#### Parcel Management (`/api/parcels`)
- `GET /` - List user's parcels
- `POST /` - Create new parcel
- `GET /{id}` - Get parcel details
- `DELETE /{id}` - Delete parcel
- `PUT /{id}/address` - Request address change

#### Tracking (`/api/tracking`)
- `GET /{trackingCode}` - Track parcel by code

#### Locations (`/api/locations`)
- `GET /` - List available pickup/delivery locations

### Authentication Methods

#### JWT Authentication
Include JWT token in the Authorization header:
```http
Authorization: Bearer {jwt_token}
```

#### API Key Authentication
Include API key in custom header:
```http
X-API-Key: {api_key}
```

### Token Configuration
- **JWT TTL**: 15 minutes
- **Refresh Token TTL**: 24 hours
- **Verification Token TTL**: 24 hours

## Project Structure

```
src/main/java/com/tcs/dhv/
├── config/                         # Configuration classes
│   ├── JwtConfig.java                 # JWT RSA key configuration
│   ├── MailConfig.java                # Email service configuration
│   └── SecurityConfig.java            # Spring Security configuration
├── controller/                     # REST API controllers
│   ├── AuthController.java            # Authentication endpoints
│   ├── LocationController.java        # Location management
│   ├── ParcelsController.java         # Parcel operations
│   ├── TrackingController.java        # Tracking services
│   └── UserController.java            # User management
├── domain/                         # Domain models and DTOs
│   ├── dto/                           # Data Transfer Objects
│   ├── entity/                        # JPA entities
│   └── enums/                         # Application enumerations
├── exception/                      # Exceptions package
│   └── GlobalExceptionHandler.java    # Global exception handling
├── repository/                     # JPA repositories
├── security/                       # Security components
├── service/                        # Business logic layer
├── util/                           # Utility classes
└── validation/                     # Custom validation annotations

src/main/resources/
├── db/migration/                   # Flyway database migrations
├── jwt/                            # RSA key pairs for JWT
├── templates/                      # Email templates
└── application.yml                 # Application configuration
```

## Additional Documentation

### API Documentation
- **Swagger UI**: Available at `http://localhost:8080/swagger-ui.html` (when running)
- **OpenAPI Spec**: Available at `http://localhost:8080/v3/api-docs`

### Email Testing
- **MailHog UI**: http://localhost:8025 (view sent emails during development)
- **SMTP Server**: localhost:1025 (configured automatically)

### Frontend Integration
- **Frontend URL**: http://localhost:5173
- **CORS**: Configured for local development

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database services
docker compose restart postgres

# Check logs
docker compose logs postgres
```

#### 2. JWT Key Issues
```bash
# Verify JWT keys exist
ls -la src/main/resources/jwt/
```

#### 3. Email Service Issues
```bash
# Check MailHog is running
docker ps | grep mailhog

# Access MailHog UI
open http://localhost:8025
```

#### 4. Port Conflicts
```bash
# Check what's using port 8080
lsof -i :8080

# If port is in use, use different port
```

### Environment-Specific Issues

#### Docker Issues
```bash
# Reset Docker environment
docker compose down -v
docker compose up -d
```

#### IntelliJ IDEA Issues
1. **Reload Maven Project**: Right-click `pom.xml` → Maven → Reload project
2. **Invalidate Caches**: File → Invalidate Caches and Restart
3. **Check SDK**: File → Project Structure → Project → Project SDK (should be Java 21)
4. **Check Run Configuration**: Ensure environment variables are set correctly