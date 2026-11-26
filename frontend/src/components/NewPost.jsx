// Displays the form for writing a new postcard.
// Sends the message to the API and pass the saved post back to App.
import { createPost } from "../messageApi";
import MessageForm from "./MessageForm";

function NewPost({ onPostCreated }) {
  // createPost saves the message through the API.
  // onPostCreated comes from App and calls App's handlePostCreated function.
  async function handleCreatePost(content) {
    const savedPost = await createPost(content);
    onPostCreated(savedPost);
  }

  return (
    <section className="new-post-card">
      <h2>📮 Post Office</h2>
      <MessageForm
        label="Write a postcard"
        submitLabel="Add"
        onSubmit={handleCreatePost}
      />
    </section>
  );
}

export default NewPost;
