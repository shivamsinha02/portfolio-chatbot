const BASE = import.meta.env.VITE_API_URL || "";

async function fail(res) {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.detail || "Something went wrong. Please try again.");
}

export async function getProfile() {
  const res = await fetch(`${BASE}/api/profile`);
  if (!res.ok) await fail(res);
  return res.json();
}

// Streams plain-text tokens from the backend and calls onToken for each piece.
export async function streamChat(messages, onToken, signal) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok) await fail(res);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
}
