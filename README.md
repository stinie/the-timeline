# The Timeline

A learning project by Christine Fürst, developed through five backend assignments using Node.js, Express, EJS and MongoDB, now continuing with React.

One evolving application, with each development stage preserved in its own Git branch.

## Run locally

Requires Node.js 20.19 or newer and npm.

Install the backend dependencies from the project root:

```bash
npm install
```

Create a private `.env` file in the project root:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/
PORT=3000
JWT_SECRET=<your-random-signing-secret>
```

Replace the placeholders with your MongoDB Atlas credentials and a secure JWT signing secret. The database user needs read/write access to `the-timeline`, and Atlas must allow your IP address.

Authentication now identifies users through login and JWT cookies, so `DEV_USER_ID` is no longer needed.

Keep `.env` excluded from Git. Never commit your credentials or signing secret.

Start the backend:

```bash
npm run dev
```

Open http://localhost:3000.

The development script uses Nodemon. Alternatively, run `npm start`. The application starts listening after connecting to MongoDB.

### React frontend

The React application has its own dependencies and development server.

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually http://localhost:5173.

The backend and frontend run separately during development. Both need to be running once React is connected to the Express API.

## Development stages

The first five assignments belong to the Node.js backend course. The React course continues from the completed authentication stage.

| Assignment | Branch | Focus |
| --- | --- | --- |
| Backend 1 | `json` | JSON and EJS |
| Backend 2 | `database` | MongoDB CRUD |
| Backend 3 | `comments` | Comments |
| Backend 4 | `api` | REST API |
| Backend 5 | `authentication` | Authentication |
| React 3 | `react-frontend` | React frontend for The Timeline |


## Assignment 1 — JSON

Built the first Timeline using Express, EJS and JSON data, with validation, sorting and formatted dates.

## Assignment 2 — Database

Replaced JSON storage with MongoDB Atlas and Mongoose. Implemented and manually tested CRUD operations, including form validation, individual post views and error handling.

## Assignment 3 — Comments

Implemented User–Post–Comment relationships and server-side validation for all forms, requiring a minimum of 25 characters for posts and comments.

## Assignment 4 — API

Extended The Timeline with a REST API that provides JSON responses alongside the existing EJS-based web interface.

Implemented API endpoints for retrieving, creating, updating and deleting posts using the HTTP methods GET, POST, PUT, PATCH and DELETE.

Tested the API using Postman, including request validation, invalid IDs, missing resources and error responses.

The API and web interface share the same MongoDB database.

## Assignment 5 — Authentication

Added registration, JWT login and logout, and password hashing with bcrypt. Guests can view posts, while logged-in users can create posts and comments and edit or delete their own content. The header displays the logged-in user’s name and a logout button. Tested through the website and Postman.

---

## React Assignment 3 — The Timeline

**Branch:** `react-frontend`

This assignment builds on Backend Assignment 5 (`authentication`).

I built a React frontend with Vite that uses my existing Express JSON API to create, display, edit and delete posts and comments.

The original EJS frontend remains available.

### Project structure

- **Backend:** Express, in the project root.
- **Frontend:** React and Vite, in `frontend/`.

Both have their own `package.json` and dependencies.

I considered npm workspaces but chose to avoid restructuring the project during this assignment. My priority is learning React and understanding how it communicates with my existing backend.


### Authentication during development

I reuse the existing Express login rather than building a separate React login interface.

Log in at `http://localhost:3000/login`, then open React at `http://localhost:5173`.

The Vite proxy forwards API requests to Express, which handles authentication through the existing login cookie.

React does not yet track which user is logged in.

### Running both servers

Run `npm run dev` in two terminals:

- **Project root:** Express on port `3000`.
- **`frontend/`:** Vite on port `5173`.

Keep both servers running during development.