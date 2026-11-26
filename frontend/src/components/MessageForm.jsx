import { useState } from "react";

function MessageForm({
  label,
  submitLabel,
  initialContent = "",
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (trimmedContent.length < 25) {
      setError("Please enter at least 25 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // The parent saves the content and throws if the request fails.
      await onSubmit(trimmedContent);

      // Clear the form only after a successful save.
      setContent("");
    } catch (err) {
      setError(err.message || "Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <label>
        {label}
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          required
          disabled={saving}
        />
      </label>

      <small>A little more to say? Write at least 25 characters.</small>

      {error && <p role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MessageForm;
