// Authentication is currently handled by the Express backend.
// The browser sends the login cookie with API requests.
// React does not yet track which user is logged in.
// This keeps the frontend working until we add user awareness to React.
// Keep HTTP details here; components own React state and user feedback.

import axios from "axios";

async function requestJson(url, options, fallbackMessage) {
  try {
    const response = await axios({
      url,
      method: options.method,
      headers: options.headers,
      data: options.body,
      signal: options.signal,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || fallbackMessage);
    }

    throw error;
  }
}

export async function getPosts(signal) {
  const data = await requestJson(
    "/api/posts",
    { signal },
    "Unable to load posts."
  );
  return data.posts;
}

export async function createPost(content) {
  const data = await requestJson(
    "/api/posts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    "Unable to create the post."
  );
  return data.post;
}

export async function savePostChanges(postId, content) {
  const data = await requestJson(
    `/api/posts/${postId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    "Unable to update the post."
  );
  return data.post;
}

export async function deletePost(postId) {
  return requestJson(
    `/api/posts/${postId}`,
    { method: "DELETE" },
    "Unable to delete the post."
  );
}

export async function getComments(postId, signal) {
  const data = await requestJson(
    `/api/posts/${postId}/comments`,
    { signal },
    "Unable to load comments."
  );
  return data.comments;
}

export async function createComment(postId, content) {
  const data = await requestJson(
    `/api/posts/${postId}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    "Unable to create the comment."
  );
  return data.comment;
}

export async function saveCommentChanges(commentId, content) {
  const data = await requestJson(
    `/api/comments/${commentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
    "Unable to update the comment."
  );
  return data.comment;
}

export async function deleteComment(commentId) {
  return requestJson(
    `/api/comments/${commentId}`,
    { method: "DELETE" },
    "Unable to delete the comment."
  );
}
