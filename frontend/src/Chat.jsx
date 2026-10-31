import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function Message({ m, streaming }) {
  const [copied, setCopied] = useState(false);

  if (m.role === "user") {
    return <div className="msg user"><div className="bubble">{m.content}</div></div>;
  }
  if (!m.content) {
    return <div className="msg bot"><span className="dots" role="status" aria-label="Thinking"><i /><i /><i /></span></div>;
  }
  const copy = async () => {
    await navigator.clipboard.writeText(m.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="msg bot">
      <div className="md"><ReactMarkdown>{m.content}</ReactMarkdown></div>
      {!streaming && <button className="copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>}
    </div>
  );
}

export default function Thread({ messages, busy }) {
  const box = useRef(null);
  const stick = useRef(true);

  useEffect(() => {
    const el = box.current;
    if (messages.at(-1)?.content === "") stick.current = true; // just sent a message
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onScroll = () => {
    const el = box.current;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  return (
    <div className="thread" ref={box} onScroll={onScroll}>
      <div className="col">
        {messages.map((m, i) => (
          <Message key={i} m={m} streaming={busy && i === messages.length - 1} />
        ))}
      </div>
    </div>
  );
}
