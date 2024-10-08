# Go-Getter is a new portal that helps you track and follow your goals.

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="/assets/nestjs-logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://nestjs.com/" target="blank"><img src="/assets/angular_gradient.png" width="120" alt="Nest Logo" /></a>
</p>

This is a personal portfolio project built using the Nest.js and Angular. It focuses on providing a clean, scalable, and well-structured solution for showcasing professional work and projects. The application features various components that exhibit the best practices and implementation of various aspects related to Nest.js and modern software development.

## Features

- **Test Coverage:** Comprehensive suite of tests covering services, controllers, guards, interceptors, and modules. Unit and E2E tests.
- **Custom Guards and Middlewares:** Utilizes guards for authentication and provides custom middlewares for increased flexibility.
- **TypeORM + Migrations:** Database management using TypeORM with migration support for schema evolution.
- **Comprehensive data design:** DB-based timestamp tracking, Data association, including join tables and self-referencing association 
- **Data fetching strategies:** Utilized eager and lazy data loading to optimize query utilization
- **JWT and Local Authentication:** Implements JWT and local authentication via Passport.js for user identification and authorization.
- **Granular access control:** A set of guards to manage access based on user roles and owned resources
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
- **Multi-environment setup:** Both FE and BE have prod and development modes.

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

This project is now under a proprietary license. While the source code is available for viewing and forking, its use, reproduction, and distribution are subject to restrictions.

- Viewing and fork: Allowed for personal and educational purposes.
- Modification and Redistribution: Not allowed without express permission.
- Commercial Use: Requires a paid license and express permission from the author.

For more details, see the [LICENSE](LICENSE) file in this repository.

### Why the Change?

The license change is intended to protect the project from unauthorized commercial use while still allowing the community to learn from and engage with the code. If you're interested in using this project for commercial purposes or contributing in a way that goes beyond the scope of the new license, please contact me directly.