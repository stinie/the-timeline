# The Timeline

A learning project by Christine Fürst, developed through five assignments using Node.js, Express, EJS and MongoDB.

One evolving application, with each development stage preserved in its own Git branch.

## Run locally

Requires Node.js 20.19 or newer and npm.

Install dependencies:

```bash
npm install
```

Create a private `.env` file in the project root:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/
DEV_USER_ID=<existing-mongodb-user-id>
```

Replace the placeholders with your MongoDB Atlas credentials. The database user needs read/write access to `the-timeline`, and Atlas must allow your IP address.

`DEV_USER_ID` must contain the MongoDB ObjectId of an existing user in the database. The application uses this development user when creating posts and comments, until authentication is implemented in Assignment 5.

Keep `.env` excluded from Git. Do not commit your actual credentials or private `.env` file.

Start the development server:


```bash
npm run dev
```

Open http://localhost:3000.

The development script uses Nodemon. Alternatively, run `npm start` to start Node.js directly. The application starts listening only after connecting to MongoDB.

## Development stages

Each assignment builds on the previous one. Completed stages are preserved in separate branches, while `main` holds the latest completed assignment.

| Assignment | Branch | Focus |
| --- | --- | --- |
| 1 | `json` | JSON and EJS |
| 2 | `database` | MongoDB CRUD |
| 3 | `comments` | Comments |
| 4 | `api` | API |
| 5 | `authentication` | Authentication |

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