const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const Plus = () => (<svg {...base}><path d="M12 5v14M5 12h14" /></svg>);
export const Panel = () => (<svg {...base}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></svg>);
export const Send = () => (<svg {...base}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
export const Stop = () => (<svg {...base} fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>);
export const Trash = () => (<svg {...base} width="16" height="16"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" /></svg>);
