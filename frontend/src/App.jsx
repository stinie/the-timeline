import { HeartCat } from "trazo-stickers";
import { useEffect, useState } from "react";
import { getPosts, getCurrentUser } from "./messageApi";
import NewPost from "./components/NewPost";
import PostBoard from "./components/PostBoard";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

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

  useEffect(() => {
    const controller = new AbortController();
    let requestInProgress = false;

    async function loadCurrentUser() {
      if (requestInProgress || controller.signal.aborted) {
        return;
      }

      requestInProgress = true;
      setCheckingAuth(true);
      setAuthError("");

      try {
        const user = await getCurrentUser(controller.signal);

        if (!controller.signal.aborted) {
          setCurrentUser(user);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setCurrentUser(null);
          setAuthError(err.message || "Unable to check your login status.");
        }
      } finally {
        requestInProgress = false;
        if (!controller.signal.aborted) {
          setCheckingAuth(false);
        }
      }
    }
    // Recheck the logged-in user when returning to the Timeline tab.
    // Remove the listener and cancel pending requests when App unmounts.
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadCurrentUser();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    loadCurrentUser();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      controller.abort();
    };
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

        {!checkingAuth && !authError && !currentUser && (
          <>
            <p>
              Want to join the conversation? Log in to write postcards and
              comments.
            </p>
            <p>
              <a
                href="http://localhost:3000/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Log in through the backend
              </a>
              , then return here.
            </p>
          </>
        )}
        {!checkingAuth && !authError && currentUser && (
          <form action="http://localhost:3000/logout" method="POST">
            <button type="submit">Log out</button>
          </form>
        )}
      </header>

      {loading && <p>Loading posts…</p>}

      {error && <p role="alert">{error}</p>}
      {authError && <p role="alert">{authError}</p>}

      {!loading && !error && (
        <>
          {!checkingAuth && !authError && currentUser && (
            <NewPost onPostCreated={handlePostCreated} />
          )}
          <PostBoard
            posts={posts}
            currentUser={!checkingAuth && !authError ? currentUser : null}
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
