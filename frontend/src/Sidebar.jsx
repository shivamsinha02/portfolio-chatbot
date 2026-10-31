import { Plus, Trash, Panel } from "./icons.jsx";

export default function Sidebar({ profile, chats, activeId, onSelect, onNew, onDelete, onClose }) {
  const initials = (profile?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("");
  const history = chats.filter((c) => c.messages.length);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="sidebar" aria-label="Chat history">
        <div className="sidebar-head">
          <div className="who">
            <div className="avatar">{initials}</div>
            <div>
              <div className="who-name">{profile?.name || "Portfolio assistant"}</div>
              <div className="who-sub">Professional background</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close sidebar"><Panel /></button>
        </div>

        <button className="new-chat" onClick={onNew}><Plus /> New chat</button>

        <nav className="history">
          {history.length > 0 && <p className="group">Recent</p>}
          {history.map((c) => (
            <div key={c.id} className={`item ${c.id === activeId ? "active" : ""}`}>
              <button className="item-main" onClick={() => onSelect(c.id)}>{c.title}</button>
              <button className="item-del" onClick={() => onDelete(c.id)} aria-label={`Delete chat: ${c.title}`}><Trash /></button>
            </div>
          ))}
        </nav>

        <footer className="contact">
          {profile?.email && <a href={`mailto:${profile.email}`}>Email</a>}
          {profile?.links?.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </footer>
      </aside>
    </>
  );
}
