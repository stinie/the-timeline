import { YellowPencil } from "trazo-stickers";
import { useState } from "react";
import { savePostChanges, deletePost } from "../messageApi";
import MessageForm from "./MessageForm";
import CommentBoard from "./CommentBoard";

function PostCard({ post, onPostSaved, onPostDeleted }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSavePost(content) {
    const savedPost = await savePostChanges(post._id, content);
    onPostSaved(savedPost);
    setEditing(false);
  }

  async function handleDeletePost() {
    setDeleting(true);
    setError("");

    try {
      await deletePost(post._id);

      onPostDeleted(post._id);
    } catch (err) {
      setError(err.message || "Unable to delete the postcard.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="post">
      <span className="postcard-icon" aria-hidden="true">
        <YellowPencil size={30} title="YellowPencil" />
      </span>

      {editing ? (
        <MessageForm
          label="Edit post"
          submitLabel="Save post"
          initialContent={post.content}
          onSubmit={handleSavePost}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <p className="meta">
            <span className="author">
              {post.userId.firstName} {post.userId.lastName}
            </span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>

          <p className="content">{post.content}</p>

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
              onClick={handleDeletePost}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </>
      )}

      {error && <p role="alert">{error}</p>}

      <CommentBoard postId={post._id} />
    </article>
  );
}

export default PostCard;
