import { useEffect, useRef, useState } from "react";
import { Send, Stop } from "./icons.jsx";

export default function Composer({ onSend, onStop, busy, firstName, showNote }) {
  const [value, setValue] = useState("");
  const ta = useRef(null);

  useEffect(() => ta.current?.focus(), []);
  useEffect(() => {
    const el = ta.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim() || busy) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          ref={ta}
          rows={1}
          value={value}
          placeholder={`Ask about ${firstName ? firstName + "’s" : "their"} experience, projects or skills`}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />
        {busy ? (
          <button className="round" onClick={onStop} aria-label="Stop generating"><Stop /></button>
        ) : (
          <button className="round" onClick={submit} disabled={!value.trim()} aria-label="Send message"><Send /></button>
        )}
      </div>
      {showNote && <p className="fine">Answers come from the resume and may miss details.</p>}
    </div>
  );
}
