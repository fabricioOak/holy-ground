# HOLY-GROUND API 🚀

A robust and scalable backend API for the HOLY-GROUND project, built with a modern, decoupled architecture.

---

## ✨ Features & Architecture

This project is built following Clean Architecture principles to ensure it is scalable, testable, and maintainable.

-   **Modular Architecture**: Code is organized by feature (`modules`) rather than by layer, promoting high cohesion and low coupling.
-   **Dependency Injection**: Uses **Tsyringe** for a powerful and declarative dependency injection system, making the code loosely coupled and easy to test.
-   **Repository Pattern**: Business logic is completely decoupled from the database through repository interfaces.
-   **UseCase-Driven Logic**: Business rules are encapsulated within UseCases, providing a clear and single entry point for each application feature.
-   **Centralized Error Handling**: A global error handler provides consistent and predictable error responses.
-   **Role-Based Authorization**: Secure your routes with declarative authorization guards (`authorize({ allowed: [...] })`).
-   **Schema-based Configuration**: Environment variables are validated on startup using **Zod**, preventing runtime errors due to misconfiguration.
-   **Dockerized Environment**: The entire development environment, including the database, is managed with Docker Compose for a one-command setup.

## 🛠️ Tech Stack

-   **Backend**: Node.js 22, Fastify, TypeScript
-   **Database**: PostgreSQL 17, Drizzle ORM
-   **Dependency Injection**: Tsyringe
-   **Environment**: Docker & Docker Compose
-   **Validation**: TypeBox
-   **Logging**: Pino

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (v22 or higher)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Getting Started

Follow these steps to get the project up and running locally.

### 1. Clone the Repository

```bash
git clone git@github.com:fabricioOak/holy-ground.git
cd holy-ground
````

### 2\. Install Dependencies

Install the project dependencies. This is useful for your code editor's IntelliSense and type-checking.

```bash
npm install
```

### 3\. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file.

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values, especially the `JWT_SECRET`.

-----

## ⚙️ Running the Application

The entire development environment is managed by Docker Compose.

### To start the application and the database:

```bash
docker compose up --build
```

  - The `--build` flag is only necessary the first time you run it or if you change the `Dockerfile`.
  - This command will start the API server and a PostgreSQL database.
  - The API server uses **hot-reloading**, so any changes you make to the `src` directory will automatically restart the server.

The application will be available at:

  - **API Base URL**: `http://localhost:3000`
  - **Swagger Docs**: `http://localhost:3000/docs`

### To stop the application:

In the same terminal, press `Ctrl + C`, then run:

```bash
docker compose down
```

This will stop and remove the containers. Your database data will be preserved in a Docker volume.

## 🔑 Environment Variables

These are the environment variables used by the application. They should be defined in your `.env` file.

| Variable         | Description                                                                                             | Default Value        |
| ---------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| `NODE_ENV`       | The application environment.                                                                            | `development`        |
| `PORT`           | The port the API server will listen on.                                                                 | `3333`               |
| `JWT_SECRET`     | A strong, secret key used for signing JWT tokens.                                                       | **`MUST BE SET`** |
| `POSTGRES_USER`  | The username for the PostgreSQL database.                                                               | `docker`             |
| `POSTGRES_PASSWORD`| The password for the PostgreSQL database.                                                               | `docker`             |
| `POSTGRES_DB`    | The name of the PostgreSQL database.                                                                    | `holyground`         |
| `DATABASE_URL`   | The full connection string for the database. **Must point to the Docker service name (`db`)**.            | (See `.env.example`) |


## 📚 Project Structure

The project follows a modular architecture, designed for scalability and separation of concerns.

  - `src/modules/`: Each folder within `modules` represents a feature of the application (e.g., `users`, `auth`). Each module is self-contained and includes its own routes, controllers, use cases, and repositories.
  - `src/shared/`: Contains code that is shared across multiple modules.
      - `infra/`: The infrastructure layer, containing adapters for external concerns like the database (`db`), the web server (`http`), and security services.
      - `container/`: Configuration for the Tsyringe dependency injection container.
      - `interfaces/`, `utils/`: Reusable components shared by the application.


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
