import { HeartCat } from "trazo-stickers";
import { useEffect, useRef, useState } from "react";
import { getPosts, getCurrentUser, login, logout } from "./messageApi";
import LoginForm from "./components/LoginForm";
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
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const authCheckController = useRef(null);
  const authActionInProgress = useRef(false);

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
    let active = true;

    async function loadCurrentUser() {
      if (!active || authActionInProgress.current || authCheckController.current) {
        return;
      }

      const controller = new AbortController();
      authCheckController.current = controller;
      setCheckingAuth(true);
      setAuthError("");

      try {
        const user = await getCurrentUser(controller.signal);

        if (active && !controller.signal.aborted) {
          setCurrentUser(user);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setCurrentUser(null);
          setAuthError(err.message || "Unable to check your login status.");
        }
      } finally {
        if (authCheckController.current === controller) {
          authCheckController.current = null;
        }
        if (active && !controller.signal.aborted) {
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
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      authCheckController.current?.abort();
      authCheckController.current = null;
    };
  }, []);

  async function handleLogin(email, password) {
    if (authActionInProgress.current) {
      return;
    }

    authActionInProgress.current = true;
    authCheckController.current?.abort();
    authCheckController.current = null;
    setCheckingAuth(false);
    setAuthError("");
    setLogoutError("");

    try {
      const user = await login(email, password);
      setCurrentUser(user);
    } finally {
      authActionInProgress.current = false;
    }
  }

  async function handleLogout() {
    if (authActionInProgress.current) {
      return;
    }

    authActionInProgress.current = true;
    authCheckController.current?.abort();
    authCheckController.current = null;
    setCheckingAuth(false);
    setAuthError("");
    setLogoutError("");
    setLoggingOut(true);

    try {
      const user = await logout();
      setCurrentUser(user);
    } catch (err) {
      setLogoutError(err.message || "Unable to log out.");
    } finally {
      authActionInProgress.current = false;
      setLoggingOut(false);
    }
  }

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
            <LoginForm onSubmit={handleLogin} />
          </>
        )}
        {!checkingAuth && !authError && currentUser && (
          <>
            <button type="button" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
            {logoutError && <p role="alert">{logoutError}</p>}
          </>
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
