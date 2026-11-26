import { useEffect, useState } from "react";
import { getComments, createComment } from "../messageApi";
import MessageForm from "./MessageForm";
import CommentCard from "./CommentCard";

function CommentBoard({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      setLoading(true);
      setError("");

      try {
        const loadedComments = await getComments(postId, controller.signal);
        setComments(loadedComments);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load comments.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadComments();

    // Cancel the request when this section unmounts or postId changes.
    return () => controller.abort();
  }, [postId]);

  async function handleCreateComment(content) {
    const savedComment = await createComment(postId, content);

    // Append the saved comment to preserve oldest-first order.
    setComments((currentComments) => [
      ...currentComments,
      savedComment,
    ]);
  }

  function handleCommentSaved(updatedComment) {
    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  }

  function handleCommentDeleted(commentId) {
    setComments((currentComments) =>
      currentComments.filter((comment) => comment._id !== commentId)
    );
  }

  return (
    <section className="comments">
      <h3>Comments</h3>

      {loading && <p>Loading comments…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          {comments.length === 0 && <p>No comments yet.</p>}

          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onCommentSaved={handleCommentSaved}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}

          <MessageForm
            label="New comment"
            submitLabel="Add comment"
            onSubmit={handleCreateComment}
          />
        </>
      )}
    </section>
  );
}

export default CommentBoard;
