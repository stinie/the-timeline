import { useState } from "react";
import { saveCommentChanges, deleteComment } from "../messageApi";
import MessageForm from "./MessageForm";

function CommentCard({
  comment,
  currentUser,
  onCommentSaved,
  onCommentDeleted,
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const isOwner = Boolean(
    currentUser && currentUser._id === comment.userId?._id,
  );

  async function handleSaveComment(content) {
    const savedComment = await saveCommentChanges(comment._id, content);
    onCommentSaved(savedComment);
    setEditing(false);
  }

  async function handleDeleteComment() {
    setDeleting(true);
    setError("");

    try {
      await deleteComment(comment._id);

      onCommentDeleted(comment._id);
    } catch (err) {
      setError(err.message || "Unable to delete the comment.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="comment">
      {isOwner && editing ? (
        <MessageForm
          label="Edit comment"
          submitLabel="Save comment"
          initialContent={comment.content}
          onSubmit={handleSaveComment}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <p className="meta">
            <span className="author">
              {comment.userId.firstName} {comment.userId.lastName}
            </span>
            <span className="date">
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="content">{comment.content}</p>
          {isOwner && (
            <div className="actions">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setError("");
                  setEditing(true);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteComment}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </>
      )}

      {error && <p role="alert">{error}</p>}
    </article>
  );
}

export default CommentCard;
