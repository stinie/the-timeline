# The Timeline

Christine Fürst’s learning project: one Timeline evolving through five assignments, with small, well-understood changes at each stage.

## Current stage — Assignment 1: JSON

A Node.js and Express application that renders four sample posts from `data/posts.json` using EJS.

- The posts router is mounted at `/` and delegates rendering of `views/index.ejs` to the posts controller.
- Posts appear newest first, sorted by their original ISO timestamps.
- Display dates use UTC and ordinal suffixes, such as `October 28th 2026`, without replacing the original timestamps.
- Minimal CSS uses Commit Mono, loaded from a CDN. The footer links to Node.js, Express.js, and Commit Mono.

This stage displays existing posts. Database storage, CRUD, comments, an API, and authentication are planned.

## Run locally

Install Node.js and npm. The project does not specify a required Node.js version.

From the project directory:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Port **3000** is intentional.

The `dev` script runs `nodemon server.js` and restarts the server when files change. Use `npm start` to run with Node directly. Stop either with `Ctrl+C`. There is currently no test script; the application entry point is `server.js`.

## Project structure

```text
controllers/postsController.js  Post loading, validation, date formatting, and rendering
data/posts.json                 Four sample posts
models/post.js                  Empty placeholder for a future post model
public/                         Static assets, including style.css and index.html
routes/postsRouter.js           Connects the homepage route to the posts controller
views/index.ejs                 Current Timeline page
views/edit.ejs                  Empty placeholder
views/show.ejs                  Empty placeholder
server.js                       Express setup and server on port 3000
package.json                    Dependencies and development command
package-lock.json               Locked dependency versions
```

The homepage is rendered by EJS; `public/index.html` is not the Timeline homepage.

### Manual validation test

Temporarily add this fifth post to `data/posts.json`, placing a comma after the previous post:

```json
{
  "id": 5,
  "username": "codex",
  "authorName": "Codex",
  "createdAt": "2026-10-29T12:03:00+01:00",
  "content": 123
}
```

Expected: an error is logged, the friendly message appears, and the website stays running.

Remove the test post and its preceding comma afterward. Confirm the four original posts return.

## Planned progression

| Assignment | Focus | Status |
| --- | --- | --- |
| 1 | JSON: render sample posts with Express and EJS | Implemented |
| 2 | MongoDB: store posts and add create, read, update, and delete operations | Planned |
| 3 | Comments: add conversations to posts | Planned |
| 4 | API: expose Timeline data through API endpoints | Planned |
| 5 | Authentication: add user sign-in and access control | Planned |

The long-term vision is a central `index.ejs` showcase that makes all five stages of development visible while preserving earlier implementations. The current page shows Assignment 1 only; the five-stage showcase has not been built.

Development snapshots or short videos may eventually document the journey. These are aspirations for future work.
