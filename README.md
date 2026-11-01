Christine, **replace everything in `README.md` with the text below**. It brings the sections together and distinguishes what works now from what comes later. I haven’t changed any files.

# The Timeline

Christine Fürst’s learning project: one Timeline evolving through five assignments, with small, well-understood changes at each stage.

## Current stage — Assignment 2: Database

The `database` branch retrieves posts from MongoDB Atlas and renders them using Express and EJS. The four original sample posts now appear from the database, newest first, with readable UTC dates.

Creating, editing and deleting posts through the application are still to be added.

## Run locally

Use Node.js 20.19 or newer and npm. The application uses Node’s built-in `process.loadEnvFile()` to load local configuration.

From the project directory, install dependencies:

```sh
npm install
```

Create a `.env` file in the project root:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/
```

Replace the placeholders with your Atlas application user’s credentials and cluster hostname. Keep `.env` excluded from Git.

The database user needs read/write access to `the-timeline`, and Atlas must allow your current IP address.

Start the development server:

```sh
npm run dev
```

Open http://localhost:3000. Port **3000** is intentional. The server starts listening after MongoDB connects.

The `dev` script runs `nodemon server.js` and restarts after code changes. Use `npm start` to run `node server.js` directly. Stop either with `Ctrl+C`. There is currently no test script.

## Project structure

```text
controllers/postsController.js  MongoDB queries, date formatting and rendering
data/posts.json                 Original sample data; no longer used by the application
data/posts-atlas-import.json     Extended JSON prepared for Atlas insertion
models/post.js                  Mongoose post schema and model
public/style.css                Shared styles
routes/postsRouter.js           Homepage route connected to the controller
views/index.ejs                 Timeline page
views/partials/head.ejs         Shared head with a dynamic page title
views/partials/footer.ejs       Shared footer
views/404.ejs                   Page for unmatched requests
views/edit.ejs                  Empty placeholder
views/show.ejs                  Empty placeholder
server.js                       Express setup, middleware and MongoDB connection
package.json                    Dependencies and run commands
package-lock.json               Locked dependency versions
```

## Assignment 1 — JSON

The first implementation rendered four sample posts from `data/posts.json`. It validated the data, sorted posts by their original ISO timestamps, and displayed UTC dates with ordinal suffixes, such as `October 28th 2026`.

The posts router delegated rendering to a separate controller. Minimal CSS used Commit Mono, with footer links to Node.js, Express.js and Commit Mono.

This implementation and its JSON validation test remain preserved on the `json` branch.

## Assignment 2 — Database

### Connecting to MongoDB

I created a separate Atlas project, cluster and database named `the-timeline`, with a `posts` collection and a dedicated application user.

The connection URI is stored in a private `.env` file. `server.js` loads it and explicitly selects the database using:

```js
mongoose.connect(dbURI, { dbName: "the-timeline" })
```

The server begins listening on port 3000 only after the connection succeeds.

### Defining and retrieving posts

The Mongoose Post model defines required `username`, `authorName` and `content` fields. Content must contain at least 25 characters. Mongoose timestamps provide `createdAt` and `updatedAt`, while MongoDB supplies `_id`.

I replaced JSON loading and validation in the controller with:

```js
Post.find().sort({ createdAt: -1 }).lean()
```

MongoDB returns the posts newest first. `lean()` provides plain JavaScript objects, and the controller adds readable UTC dates before rendering the page. A friendly message appears if retrieving posts fails.

The original JSON file remains for now, but the application no longer reads it.

### Moving the sample data into Atlas

With AI assistance, I prepared an Extended JSON file from the four original posts. It omitted the old numeric IDs and represented timestamps as BSON dates using `$date`. The original creation times were preserved, with `updatedAt` initially matching `createdAt`.

I pasted the array into Atlas’s **Insert Document** editor in **EJSON** mode. Atlas generated an ObjectId for each document.

Inserting directly through Atlas bypasses Mongoose validation and automatic timestamps, so the content lengths were checked and timestamps included explicitly.

Finding the connected collection was part of the learning. The path that worked for me was **Search & Vector Search → Shortcuts → Data Explorer**, then expanding the `the-timeline` cluster, database and `posts` collection.

I confirmed that all four documents appeared in Atlas and displayed correctly on the homepage.

### Simplifying the templates

I extracted the shared head and footer into EJS partials and passed a page title from the controller. I removed the old static homepage and added an EJS 404 page.

The 404 handler stays after the router and static middleware so it handles unmatched requests. A shared navigation partial is planned.

## Preserving the stages with Git branches

Each assignment builds on the previous one. Each completed stage will remain on its own branch, with `main` holding the latest completed assignment.

| Branch | Stage |
| --- | --- |
| `main` | Latest completed assignment |
| `json` | Assignment 1 — JSON |
| `database` | Assignment 2 — MongoDB CRUD |
| `comments` | Assignment 3 — Comments |
| `api` | Assignment 4 — API |
| `authentication` | Assignment 5 — Authentication |

Assignment 1 is preserved on `json`. The `database` branch started from the same completed stage. When Assignment 2 is complete and checked, I’ll merge it into `main` and keep its branch as a snapshot. Later assignment branches will start from the updated `main`.

Each stage should run when checked out with its required dependencies and configuration. Git preserves committed code and documentation; it does not preserve live MongoDB data.

The `main`, `json` and `database` branches exist. The remaining branches are planned.

### Learning about branch order

I initially expected GitHub’s branch selector to list branches by creation date. In the selector I used, the default branch appeared first and the other names alphabetically.

In my separate Node.js Crash Course repository, `lesson-1` through `lesson-9` happened to appear in lesson order because of their names. For The Timeline, I’m keeping short, descriptive names and recording the assignment sequence here.

## Planned progression

| Assignment | Focus | Status |
| --- | --- | --- |
| 1 | JSON: display sample posts with Express and EJS | Implemented; preserved on `json` |
| 2 | MongoDB CRUD | Database connection and display implemented; create, update and delete planned |
| 3 | Comments on posts | Planned |
| 4 | API endpoints for Timeline data | Planned |
| 5 | Authentication and access control | Planned |

The long-term vision is a central `index.ejs` showcase that makes all five development stages visible. The current page displays MongoDB posts for Assignment 2; the five-stage showcase has not been built.

Development snapshots or short videos may eventually document the journey.