import { HeartCat } from "trazo-stickers";
import { useEffect, useState } from "react";
import { getPosts } from "./messageApi";
import NewPost from "./components/NewPost";
import PostBoard from "./components/PostBoard";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        const loadedPosts = await getPosts(controller.signal);
        setPosts(loadedPosts);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load posts.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    // Cancel the request when App unmounts.
    return () => controller.abort();
  }, []);

  function handlePostCreated(savedPost) {
    // Keep the newest post first.
    setPosts((currentPosts) => [savedPost, ...currentPosts]);
  }

  function handlePostSaved(updatedPost) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  }

  function handlePostDeleted(postId) {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId),
    );
  }

  return (
    <main className="timeline">
      <header>
        <h1>The Timeline</h1>
        <p>A little place to send postcards and exchange thoughts.</p>

        <p>
          Want to join the conversation? Log in to write postcards and comments.
        </p>
        <p>
          <a
            href="http://localhost:3000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Log in through the backend
          </a>
          , then return here.
        </p>
      </header>

      {loading && <p>Loading posts…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <NewPost onPostCreated={handlePostCreated} />
          <PostBoard
            posts={posts}
            onPostSaved={handlePostSaved}
            onPostDeleted={handlePostDeleted}
          />
        </>
      )}
      <footer className="timeline-footer">
        <HeartCat size={80} title="Heart cat" />
      </footer>
    </main>
  );
}

export default App;
