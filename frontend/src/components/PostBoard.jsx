import PostCard from "./PostCard";

// Displays all postcards from the posts array.
// Creates one PostCard for each post.
function PostBoard({ posts, currentUser, onPostSaved, onPostDeleted }) {
  return (
    <section aria-label="Postcard board">
      {posts.length === 0 && (
        <p>No postcards on the board yet. Be the first to post one!</p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          onPostSaved={onPostSaved}
          onPostDeleted={onPostDeleted}
        />
      ))}
    </section>
  );
}

export default PostBoard;
