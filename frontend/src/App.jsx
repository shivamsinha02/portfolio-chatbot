import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Thread from "./Chat.jsx";
import Composer from "./Composer.jsx";
import { Panel, Plus } from "./icons.jsx";
import { getProfile, streamChat } from "./api.js";

const KEY = "portfolio-chats";
const isMobile = () => window.innerWidth <= 860;
const blankChat = () => ({ id: crypto.randomUUID(), title: "New chat", messages: [] });
const loadChats = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}
  return [blankChat()];
};

export default function App() {
  const [chats, setChats] = useState(loadChats);
  const [activeId, setActiveId] = useState(() => chats[0].id);
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(() => !isMobile());
  const abortRef = useRef(null);

  const active = chats.find((c) => c.id === activeId) || chats[0];
  const empty = active.messages.length === 0;
  const firstName = profile?.name?.split(" ")[0];

  useEffect(() => {
    getProfile().then(setProfile).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!busy) localStorage.setItem(KEY, JSON.stringify(chats));
  }, [chats, busy]);

  const update = (id, fn) => setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));
  const closeOnMobile = () => isMobile() && setOpen(false);

  function newChat() {
    if (!empty) {
      const c = blankChat();
      setChats((cs) => [c, ...cs]);
      setActiveId(c.id);
    }
    setError("");
    closeOnMobile();
  }

  function deleteChat(id) {
    const rest = chats.filter((c) => c.id !== id);
    const next = rest.length ? rest : [blankChat()];
    setChats(next);
    if (id === activeId) setActiveId(next[0].id);
  }

  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    const id = active.id;
    const history = [...active.messages, { role: "user", content: q }];
    update(id, (c) => ({
      ...c,
      title: c.messages.length ? c.title : q.slice(0, 40),
      messages: [...history, { role: "assistant", content: "" }],
    }));
    setBusy(true);
    setError("");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      await streamChat(
        history,
        (token) =>
          update(id, (c) => {
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            msgs[msgs.length - 1] = { ...last, content: last.content + token };
            return { ...c, messages: msgs };
          }),
        ctrl.signal
      );
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      // Drop an assistant message that never received any text.
      update(id, (c) => (c.messages.at(-1)?.content === "" ? { ...c, messages: c.messages.slice(0, -1) } : c));
      setBusy(false);
    }
  }

  const composer = (
    <Composer onSend={send} onStop={() => abortRef.current?.abort()} busy={busy} firstName={firstName} showNote={!empty} />
  );

  return (
    <div className={`app ${open ? "open" : ""}`}>
      <Sidebar
        profile={profile}
        chats={chats}
        activeId={active.id}
        onSelect={(id) => { setActiveId(id); setError(""); closeOnMobile(); }}
        onNew={newChat}
        onDelete={deleteChat}
        onClose={() => setOpen(false)}
      />
      <main className="main">
        <header className="topbar">
          {!open && (
            <>
              <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open sidebar"><Panel /></button>
              <button className="icon-btn" onClick={newChat} aria-label="New chat"><Plus /></button>
            </>
          )}
          <span className="top-title">{profile?.name ? `${profile.name}’s assistant` : "Portfolio assistant"}</span>
        </header>

        {empty ? (
          <section className="landing">
            <h1>{firstName ? `What would you like to know about ${firstName}?` : "What would you like to know?"}</h1>
            {error && <div className="error" role="alert">{error}</div>}
            {composer}
            <div className="chips">
              {profile?.suggestions?.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </section>
        ) : (
          <>
            <Thread key={active.id} messages={active.messages} busy={busy} />
            {error && <div className="error" role="alert">{error}</div>}
            {composer}
          </>
        )}
      </main>
    </div>
  );
}
