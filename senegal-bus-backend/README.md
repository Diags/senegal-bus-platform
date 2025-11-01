# Bus Sénégal Backend API

Backend API for the Bus Sénégal platform - A bus reservation system adapted for Senegal.

## 🚀 Technologies

- **Java 21** (LTS)
- **Spring Boot 3.5.7**
- **Spring Security** with Keycloak OAuth2
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**

## 📦 Project Structure

```
com.bus.senegal/
├── config/          # Configuration classes (Security, CORS)
├── controller/      # REST Controllers
├── service/         # Business logic
├── repository/      # Data access layer (Spring Data JPA)
├── model/           # JPA Entities
├── dto/             # Data Transfer Objects
├── exception/       # Custom exceptions and handlers
└── security/        # Security utilities
```

## 🗄️ Database Entities

### Core Models
- **User**: Users with roles (CLIENT, COMPAGNIE, ADMIN)
- **Company**: Bus companies
- **Bus**: Vehicle details and amenities
- **Route**: City-to-city routes with distances
- **Trip**: Scheduled trips with pricing
- **Seat**: Individual seat management per trip
- **Booking**: Customer reservations
- **Payment**: Payment processing and tracking
- **Notification**: SMS/Email/WhatsApp notifications

## 🔐 Security

- **Keycloak** integration for authentication and authorization
- JWT-based stateless authentication
- Role-based access control (RBAC)
- CORS configuration for frontend integration

## ⚙️ Configuration

### Application Profiles

- **dev**: Local development with H2/PostgreSQL
- **prod**: Production configuration with environment variables

### Key Configuration Files

- `application.yml`: Main configuration
- `SecurityConfig.java`: Security and OAuth2 setup
- `GlobalExceptionHandler.java`: Centralized exception handling

## 🚀 Running the Application

### Prerequisites
- Java 21 installed
- PostgreSQL running on localhost:5432
- Keycloak configured and running

### Steps

1. **Configure Database**
   ```bash
   createdb bus_senegal_dev
   ```

2. **Configure Keycloak**
   - Realm: `bus-senegal`
   - Client ID configured for resource server

3. **Run Application**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access API**
   - Base URL: `http://localhost:8080/api`
   - Actuator Health: `http://localhost:8080/api/actuator/health`

## 📝 API Endpoints

### Public Endpoints
- `GET /api/routes` - List all routes
- `POST /api/trips/search` - Search available trips

### Protected Endpoints

#### Client Role
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List user bookings
- `POST /api/payments` - Process payment

#### Company Role
- `GET /api/companies` - List companies
- `POST /api/buses` - Add bus
- `POST /api/trips` - Create trip

#### Admin Role
- `GET /api/admin/users` - Manage users
- `GET /api/admin/stats` - System statistics

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report
```

## 📦 Build

```bash
# Clean and package
./mvnw clean package

# Create executable JAR
./mvnw clean package -DskipTests
java -jar target/senegal-bus-backend-0.0.1-SNAPSHOT.jar
```

## 🔧 Development

### Code Style
- Lombok for reducing boilerplate
- Java 21 records for DTOs
- Constructor injection (no field injection)
- Transaction management with `@Transactional`

### Database Migration
- Currently using `ddl-auto: update` for development
- Production recommendation: Use Flyway or Liquibase

## 📄 License

Proprietary - Bus Sénégal Platform

## 👥 Authors

Bus Sénégal Development Team

