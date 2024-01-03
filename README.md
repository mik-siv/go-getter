# Go-Getter is a new portal that helps you track and follow your goals.

![Nest.js](https://nestjs.com/img/logo_text.svg)

This is a personal portfolio project built using the Nest.js framework. It focuses on providing a clean, scalable, and well-structured solution for showcasing professional work and projects. The application features various components that exhibit the best practices and implementation of various aspects related to Nest.js and modern software development.

## Features

- **Test Coverage:** Comprehensive suite of tests covering services, controllers, guards, interceptors, and modules. Unit and E2E tests.
- **Custom Guards and Middlewares:** Utilizes guards for authentication and provides custom middlewares for increased flexibility.
- **TypeORM + Migrations:** Database management using TypeORM with migration support for schema evolution.
- **Comprehensive data design:** DB-based timestamp tracking, Data association, including join tables and self-referencing association
- **JWT and Local Authentication:** Implements JWT and local authentication via Passport.js for user identification and authorization.
- **Centralized authentication guards and custom public routes:** All the routes are protected with the JWT auth guard by default with an option to reveal them as public
- **Validation Pipes:** Ensures accurate and consistent request data with validation pipes.
- **Centralized response interception:** password field is being stripped out of response body using global Nest.js interceptor
- **Centralized error handling:** Exceptions across the application are being handled using Nest.js Filters
- **Dynamic Module Loading:** Utilizes dynamic module loading for efficient module management.
- **API Documentation:** Thorough API documentation using tools like Swagger UI.
- **Clean Architecture:** Adheres to a clean architecture for maintainability and modularity.
- **Automated Linting and Formatting:** Pre-commit hooks for automated linting and code formatting using Husky.
- **Turbo Pipelines for Monorepo:** Optimized CI/CD pipeline setup for monorepo approach.
- **Automated GitHub Actions pipelines:** Linting, Tests, Deploys and Tagging are fully automated using GH Actions
- **Multi-environment setup:** Database connections are managed per environment.

## Getting Started

1. **Prerequisites:** Node.js, npm, PostgreSQL, and Git installed.
2. **Installation:** Clone the repository, install dependencies, and configure environment variables.
3. **Run the Application locally:** Use `npm run start:dev`.

## Usage

1. **Explore the API Endpoints:** Use Swagger UI or Postman.
2. **Register/Authenticate:** Access protected resources after authentication.

## Testing

Run tests using `npm run test`.

## Contributing

Contributions are welcome! Fork the repository and create a pull request.

## License

This project is licensed under the MIT License.