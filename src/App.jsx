import { useState, useEffect, useRef } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Jost:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

// ── Global Styles ──────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:        #06070d;
    --surface:   #0d0f1a;
    --surface2:  #131628;
    --surface3:  #191c30;
    --gold:      #c8a96e;
    --gold2:     #e8c98a;
    --gold-dim:  #7a6440;
    --accent:    #4a6fa5;
    --accent2:   #6a8fca;
    --emerald:   #2e7d5e;
    --ruby:      #8b2252;
    --sapphire:  #1a4a8a;
    --text:      #e8e2d5;
    --text2:     #a09a8c;
    --text3:     #6a6560;
    --border:    rgba(200,169,110,0.15);
    --border2:   rgba(200,169,110,0.08);
    --shadow:    0 8px 32px rgba(0,0,0,0.6);
    --r:         10px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Jost', sans-serif; min-height: 100vh; }
  .cinzel { font-family: 'Cinzel', serif; }
  .cormorant { font-family: 'Cormorant Garamond', serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }

  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  @keyframes shimmer { 0%,100% { opacity:.4; } 50% { opacity:1; } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(200,169,110,.4); } 70% { box-shadow: 0 0 0 8px rgba(200,169,110,0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn .4s ease both; }

  button { cursor: pointer; font-family: 'Jost', sans-serif; }
  input, textarea, select {
    font-family: 'Jost', sans-serif;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 6px;
    padding: 10px 14px;
    outline: none;
    font-size: 13px;
    transition: border .2s;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--gold); }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  select option { background: var(--surface2); }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalCSS;
document.head.appendChild(styleEl);

// ── Seed Data ─────────────────────────────────────────────────────────────
const GEMS_SEED = [
  { id: "g1", sellerId: "s1", name: "Kashmir Blue Sapphire", origin: "Kashmir, India", type: "Sapphire", weight: "4.35 ct", certification: "GIA", certNo: "GIA-2024-8821", description: "Exceptional velvety cornflower blue with no heat treatment. Classic Kashmir origin.", img: "sapphire", adminStatus: "approved", listedAt: "2024-02-10" },
  { id: "g2", sellerId: "s1", name: "Pigeon Blood Ruby", origin: "Mogok, Myanmar", type: "Ruby", weight: "2.18 ct", certification: "Gübelin", certNo: "GUB-2024-0032", description: "Natural unheated Mogok ruby with vivid pigeon blood red hue and silk inclusions.", img: "ruby", adminStatus: "approved", listedAt: "2024-02-15" },
  { id: "g3", sellerId: "s2", name: "Colombian Emerald", origin: "Muzo, Colombia", type: "Emerald", weight: "3.72 ct", certification: "AGL", certNo: "AGL-2024-1145", description: "Vivid green emerald from Muzo mines, minor oil only.", img: "emerald", adminStatus: "approved", listedAt: "2024-03-01" },
  { id: "g4", sellerId: "s2", name: "Alexandrite", origin: "Ural, Russia", type: "Alexandrite", weight: "1.05 ct", certification: "GRS", certNo: "GRS-2024-7723", description: "Natural Alexandrite showing remarkable color change from green to red.", img: "alexandrite", adminStatus: "pending", listedAt: "2024-03-12" },
  { id: "g5", sellerId: "s1", name: "Padparadscha Sapphire", origin: "Sri Lanka", type: "Sapphire", weight: "2.60 ct", certification: "GIA", certNo: "GIA-2024-5534", description: "Rare lotus-blossom padparadscha with perfect salmon-pink hue.", img: "padparadscha", adminStatus: "approved", listedAt: "2024-03-05" },
];

const SELLERS_SEED = [
  { id: "s1", name: "Mihiri Gems Ltd.", email: "mihiri@gems.lk", phone: "+94 77 123 4567", licenseNo: "GEM-LIC-2024-001", status: "verified", joinedAt: "2024-01-15", docs: ["seller_license.pdf", "nic_copy.pdf"] },
  { id: "s2", name: "Ratnapura Exports", email: "info@ratnapura.lk", phone: "+94 71 987 6543", licenseNo: "GEM-LIC-2024-002", status: "verified", joinedAt: "2024-01-28", docs: ["business_reg.pdf", "gem_license.pdf"] },
  { id: "s3", name: "Precious Stone Co.", email: "contact@psc.lk", phone: "+94 76 555 4321", licenseNo: "GEM-LIC-2024-003", status: "pending", joinedAt: "2024-03-10", docs: ["license_draft.pdf"] },
];

const REQUESTS_SEED = [
  { id: "r1", buyerName: "Amara Silva", buyerId: "b1", gemId: "g1", status: "price_offered", sellerPrice: 8500, commission: 8, requestedAt: "2024-03-14" },
  { id: "r2", buyerName: "Nimal Perera", buyerId: "b2", gemId: "g5", status: "pending_seller", sellerPrice: null, commission: null, requestedAt: "2024-03-16" },
  { id: "r3", buyerName: "Amara Silva", buyerId: "b1", gemId: "g3", status: "admin_approved", sellerPrice: 12000, commission: 8, requestedAt: "2024-03-10" },
];

// ── Gem SVG Images ─────────────────────────────────────────────────────────
const GemIcon = ({ type, size = 80 }) => {
  const palettes = {
    sapphire: ["#1a3a6a","#2a5fa8","#4a8fd8","#8ac0f0"],
    ruby: ["#6a0020","#a0003a","#d04060","#f08090"],
    emerald: ["#0a3020","#1a6040","#2a9060","#60c090"],
    alexandrite: ["#2a4a1a","#8a4a8a","#4a8a3a","#c090c0"],
    padparadscha: ["#8a3a10","#d06030","#f09060","#ffc090"],
    default: ["#4a3a2a","#7a6040","#b09060","#d0c090"],
  };
  const c = palettes[type?.toLowerCase()] || palettes.default;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`g-${type}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={c[3]} stopOpacity="0.9"/>
          <stop offset="60%" stopColor={c[2]}/>
          <stop offset="100%" stopColor={c[0]}/>
        </radialGradient>
      </defs>
      {/* Crown */}
      <polygon points="50,8 62,28 80,18 74,38 90,42 74,46 80,66 62,56 50,76 38,56 20,66 26,46 10,42 26,38 20,18 38,28" fill={`url(#g-${type})`} stroke={c[3]} strokeWidth="0.5" opacity="0.3"/>
      {/* Main gem */}
      <polygon points="50,12 78,36 70,72 50,82 30,72 22,36" fill={`url(#g-${type})`} stroke={c[2]} strokeWidth="0.8"/>
      {/* Table */}
      <polygon points="50,22 66,34 62,54 50,60 38,54 34,34" fill={c[1]} opacity="0.5"/>
      {/* Highlight */}
      <ellipse cx="43" cy="32" rx="8" ry="5" fill="white" opacity="0.25" transform="rotate(-20,43,32)"/>
    </svg>
  );
};

// ── Shared UI Components ───────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    verified: { bg: "#0d2a1a", color: "#4ade80", label: "Verified" },
    pending: { bg: "#2a1e08", color: "#fbbf24", label: "Pending" },
    rejected: { bg: "#2a0d0d", color: "#f87171", label: "Rejected" },
    approved: { bg: "#0d2a1a", color: "#4ade80", label: "Approved" },
    pending_seller: { bg: "#2a1e08", color: "#fbbf24", label: "Pending Seller" },
    price_offered: { bg: "#0d1e2a", color: "#60a5fa", label: "Price Offered" },
    buyer_accepted: { bg: "#1a0d2a", color: "#c084fc", label: "Buyer Accepted" },
    admin_approved: { bg: "#0d2a1a", color: "#4ade80", label: "Admin Approved" },
    delivered: { bg: "#1a2a0d", color: "#86efac", label: "Delivered" },
  };
  const s = map[status] || { bg: "#1a1a1a", color: "#888", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 20, transition: "border .2s, transform .2s", cursor: onClick ? "pointer" : "default", ...(onClick ? { ":hover": { border: "1px solid var(--gold)" } } : {}), ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "gold", size = "md", disabled, style }) => {
  const variants = {
    gold: { background: "linear-gradient(135deg,#b8922e,#c8a96e)", color: "#1a1200", border: "none" },
    ghost: { background: "transparent", color: "var(--gold)", border: "1px solid var(--border)" },
    danger: { background: "#2a0a0a", color: "#f87171", border: "1px solid #f8717133" },
    success: { background: "#0a2a0f", color: "#4ade80", border: "1px solid #4ade8033" },
    blue: { background: "#0a1a2a", color: "#60a5fa", border: "1px solid #60a5fa33" },
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "9px 20px", fontSize: 13 }, lg: { padding: "12px 28px", fontSize: 14 } };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...variants[variant], ...sizes[size], borderRadius: 6, fontWeight: 500, fontFamily: "'Jost', sans-serif", letterSpacing: "0.03em", transition: "opacity .2s, transform .1s", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", animation: "fadeIn .25s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 className="cinzel" style={{ color: "var(--gold)", fontSize: 16 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: 20, lineHeight: 1, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
    <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
    {label && <span style={{ color: "var(--text3)", fontSize: 11, letterSpacing: "0.1em" }}>{label}</span>}
    {label && <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>}
  </div>
);

const Toast = ({ msg, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: "var(--surface2)", border: "1px solid var(--gold)", borderRadius: 8, padding: "12px 20px", color: "var(--text)", fontSize: 13, zIndex: 9999, animation: "fadeIn .3s ease", boxShadow: "0 8px 24px rgba(0,0,0,.5)" }}>
      ✦ {msg}
    </div>
  );
};

// ── BUYER DASHBOARD ────────────────────────────────────────────────────────
const BuyerDashboard = ({ gems, requests, sellers, onRequestBuy, toast }) => {
  const [view, setView] = useState("browse");
  const [filter, setFilter] = useState({ type: "", origin: "", cert: "" });
  const [selectedGem, setSelectedGem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  const approvedGems = gems.filter(g => g.adminStatus === "approved");
  const types = [...new Set(approvedGems.map(g => g.type))];

  const filtered = approvedGems.filter(g => {
    if (filter.type && g.type !== filter.type) return false;
    if (filter.origin && !g.origin.toLowerCase().includes(filter.origin.toLowerCase())) return false;
    return true;
  });

  const myRequests = requests.filter(r => r.buyerId === "b1");

  const hasPendingRequest = (gemId) => myRequests.some(r => r.gemId === gemId && !["rejected", "delivered"].includes(r.status));

  return (
    <div className="fade-in">
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        {[["browse", "Browse Gemstones"], ["requests", "My Requests"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "var(--surface2)" : "none", border: view === v ? "1px solid var(--gold)" : "1px solid transparent", color: view === v ? "var(--gold)" : "var(--text2)", borderRadius: 20, padding: "7px 18px", fontSize: 13, cursor: "pointer", transition: "all .2s" }}>
            {l}
          </button>
        ))}
      </div>

      {view === "browse" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} style={{ width: "auto", minWidth: 140 }}>
              <option value="">All Types</option>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Filter by origin…" value={filter.origin} onChange={e => setFilter(f => ({ ...f, origin: e.target.value }))} style={{ maxWidth: 200 }}/>
          </div>

          {/* Gem Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {filtered.map(gem => {
              const seller = sellers.find(s => s.id === gem.sellerId);
              const alreadyRequested = hasPendingRequest(gem.id);
              return (
                <div key={gem.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "border .2s, transform .2s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
                  {/* Gem visual */}
                  <div style={{ background: "linear-gradient(135deg,#0d0f1a,#131628)", padding: "28px 0", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid var(--border2)" }}
                    onClick={() => { setSelectedGem(gem); setDetailOpen(true); }}>
                    <GemIcon type={gem.img} size={80}/>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <h4 className="cormorant" style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>{gem.name}</h4>
                    </div>
                    <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 4 }}>🌍 {gem.origin}</p>
                    <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 10 }}>⚖️ {gem.weight}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ color: "var(--gold)", fontSize: 12 }}>✅ {gem.certification} Certified</span>
                      <span style={{ background: "#0d1e0d", color: "#4ade80", border: "1px solid #4ade8022", borderRadius: 20, padding: "2px 8px", fontSize: 10 }}>✓ Verified Seller</span>
                    </div>
                    <Btn size="sm" variant={alreadyRequested ? "ghost" : "gold"} disabled={alreadyRequested} onClick={() => { if (!alreadyRequested) { setSelectedGem(gem); setDetailOpen(true); } }} style={{ width: "100%" }}>
                      {alreadyRequested ? "Request Sent" : "Request to Buy"}
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === "requests" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>My Purchase Requests</h3>
          {myRequests.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text3)", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
              <p>No requests yet. Browse gemstones to get started.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myRequests.map(req => {
                const gem = gems.find(g => g.id === req.gemId);
                const seller = sellers.find(s => s.id === gem?.sellerId);
                return (
                  <div key={req.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <GemIcon type={gem?.img} size={48}/>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <h4 className="cormorant" style={{ fontSize: 17, color: "var(--text)" }}>{gem?.name}</h4>
                      <p style={{ color: "var(--text2)", fontSize: 12 }}>{seller?.name} · Requested {req.requestedAt}</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      {req.sellerPrice && <p style={{ color: "var(--gold)", fontSize: 18, fontWeight: 600 }}>USD {req.sellerPrice.toLocaleString()}</p>}
                      {req.commission && <p style={{ color: "var(--text3)", fontSize: 11 }}>+{req.commission}% authority fee</p>}
                      {req.sellerPrice && req.commission && <p style={{ color: "var(--gold2)", fontSize: 14, marginTop: 2 }}>Total: USD {(req.sellerPrice * (1 + req.commission / 100)).toLocaleString()}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <Badge status={req.status}/>
                      {req.status === "price_offered" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn size="sm" variant="success" onClick={() => { onRequestBuy("accept", req.id); toast("Purchase request sent to admin!"); }}>Accept Price</Btn>
                          <Btn size="sm" variant="danger" onClick={() => { onRequestBuy("reject_buyer", req.id); }}>Decline</Btn>
                        </div>
                      )}
                      {req.status === "admin_approved" && (
                        <span style={{ color: "#4ade80", fontSize: 12 }}>✓ Awaiting delivery from seller</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Gem Detail Modal */}
      <Modal open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedGem(null); setRequestNote(""); }} title="Gemstone Details">
        {selectedGem && (() => {
          const seller = sellers.find(s => s.id === selectedGem.sellerId);
          const alreadyReq = hasPendingRequest(selectedGem.id);
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, background: "var(--surface2)", borderRadius: 8, padding: 24 }}>
                <GemIcon type={selectedGem.img} size={110}/>
              </div>
              <h2 className="cormorant" style={{ fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{selectedGem.name}</h2>
              <p className="cormorant" style={{ color: "var(--text2)", fontSize: 16, marginBottom: 16, fontStyle: "italic" }}>{selectedGem.origin}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[["Type", selectedGem.type], ["Weight", selectedGem.weight], ["Certification", selectedGem.certification], ["Cert. No.", selectedGem.certNo]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--surface2)", borderRadius: 6, padding: "10px 14px" }}>
                    <p style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>{k}</p>
                    <p style={{ color: "var(--gold)", fontSize: 13 }}>{v}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{selectedGem.description}</p>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text2)", fontSize: 13 }}>Seller: <strong style={{ color: "var(--text)" }}>{seller?.name}</strong></span>
                <Badge status="verified"/>
              </div>
              <div style={{ background: "#1a1200", border: "1px solid var(--gold-dim)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <p style={{ color: "var(--gold)", fontSize: 12 }}>ℹ️ Price is not publicly listed. Submit a request to receive a price offer from the seller.</p>
              </div>
              {!alreadyReq ? (
                <>
                  <textarea placeholder="Add a note to the seller (optional)…" value={requestNote} onChange={e => setRequestNote(e.target.value)} rows={3} style={{ marginBottom: 12 }}/>
                  <Btn style={{ width: "100%" }} onClick={() => { onRequestBuy("new", selectedGem.id, requestNote); setDetailOpen(false); setRequestNote(""); toast("Request sent to seller!"); }}>
                    ✦ Send Purchase Request
                  </Btn>
                </>
              ) : (
                <div style={{ background: "#0d2a1a", borderRadius: 8, padding: 14, textAlign: "center", color: "#4ade80", fontSize: 13 }}>
                  ✓ You have already sent a request for this gemstone
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ── SELLER DASHBOARD ───────────────────────────────────────────────────────
const SellerDashboard = ({ seller, gems, requests, onAddGem, onPriceRequest, onRejectRequest, toast }) => {
  const [view, setView] = useState("overview");
  const [addModal, setAddModal] = useState(false);
  const [newGem, setNewGem] = useState({ name: "", origin: "", type: "Sapphire", weight: "", certification: "GIA", certNo: "", description: "" });
  const [priceModal, setPriceModal] = useState(null);
  const [price, setPrice] = useState("");
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");

  const myGems = gems.filter(g => g.sellerId === seller.id);
  const myRequests = requests.filter(r => myGems.some(g => g.id === r.gemId));

  const pendingRequests = myRequests.filter(r => r.status === "pending_seller");

  const navItems = [
    ["overview", "Overview"],
    ["listings", `My Listings (${myGems.length})`],
    ["requests", `Buyer Requests (${pendingRequests.length})`],
    ["verification", "Verification"],
  ];

  return (
    <div className="fade-in">
      {/* Seller status banner */}
      {seller.status === "pending" && (
        <div style={{ background: "#2a1e08", border: "1px solid #fbbf24", borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <div>
            <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 500 }}>Account Pending Verification</p>
            <p style={{ color: "var(--text2)", fontSize: 12 }}>The National Gem & Jewellery Authority is reviewing your documents. You cannot list gemstones until verified.</p>
          </div>
        </div>
      )}

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 16, flexWrap: "wrap" }}>
        {navItems.map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "var(--surface2)" : "none", border: view === v ? "1px solid var(--gold)" : "1px solid transparent", color: view === v ? "var(--gold)" : "var(--text2)", borderRadius: 20, padding: "7px 18px", fontSize: 13, cursor: "pointer", transition: "all .2s" }}>
            {l}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 24, color: "var(--gold)", marginBottom: 20 }}>Welcome, {seller.name}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              ["Total Listings", myGems.length, "#4ade80"],
              ["Approved", myGems.filter(g => g.adminStatus === "approved").length, "#60a5fa"],
              ["Pending Approval", myGems.filter(g => g.adminStatus === "pending").length, "#fbbf24"],
              ["Buyer Requests", pendingRequests.length, "#c084fc"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
                <p style={{ color: "var(--text3)", fontSize: 12, marginBottom: 6 }}>{label}</p>
                <p style={{ color, fontSize: 28, fontWeight: 700 }}>{val}</p>
              </div>
            ))}
          </div>
          {seller.status === "verified" && (
            <Btn onClick={() => setAddModal(true)}>+ Add New Gemstone</Btn>
          )}
        </div>
      )}

      {view === "listings" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)" }}>My Gemstone Listings</h3>
            {seller.status === "verified" && <Btn size="sm" onClick={() => setAddModal(true)}>+ Add Gemstone</Btn>}
          </div>
          {myGems.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text3)", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
              <p>No listings yet. Add your first gemstone!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myGems.map(gem => (
                <div key={gem.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <GemIcon type={gem.img} size={54}/>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <h4 className="cormorant" style={{ fontSize: 18, color: "var(--text)" }}>{gem.name}</h4>
                    <p style={{ color: "var(--text2)", fontSize: 12 }}>{gem.origin} · {gem.weight} · {gem.certification}</p>
                    <p style={{ color: "var(--text3)", fontSize: 11 }}>Listed {gem.listedAt}</p>
                  </div>
                  <Badge status={gem.adminStatus}/>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "requests" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Buyer Purchase Requests</h3>
          {myRequests.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text3)", padding: 60 }}>
              <p>No requests yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myRequests.map(req => {
                const gem = gems.find(g => g.id === req.gemId);
                return (
                  <div key={req.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <GemIcon type={gem?.img} size={44}/>
                        <div>
                          <h4 className="cormorant" style={{ fontSize: 17, color: "var(--text)" }}>{gem?.name}</h4>
                          <p style={{ color: "var(--text2)", fontSize: 12 }}>Buyer: <strong>{req.buyerName}</strong></p>
                          <p style={{ color: "var(--text3)", fontSize: 11 }}>{req.requestedAt}</p>
                        </div>
                      </div>
                      <Badge status={req.status}/>
                    </div>
                    {req.status === "pending_seller" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn size="sm" variant="success" onClick={() => { setPriceModal(req); setPrice(""); }}>Set Price & Approve</Btn>
                        <Btn size="sm" variant="danger" onClick={() => { onRejectRequest(req.id); toast("Request rejected."); }}>Reject</Btn>
                      </div>
                    )}
                    {req.sellerPrice && (
                      <p style={{ color: "var(--gold)", fontSize: 14, marginTop: 8 }}>Your price: USD {req.sellerPrice.toLocaleString()}</p>
                    )}
                    {req.status === "admin_approved" && (
                      <div style={{ marginTop: 10, padding: "10px 14px", background: "#0d2a1a", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#4ade80", fontSize: 13 }}>✓ Admin approved — please deliver the gemstone to the buyer</span>
                        <Btn size="sm" variant="success" onClick={() => { onPriceRequest("deliver", req.id); toast("Gemstone marked as delivered!"); }}>Mark Delivered</Btn>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === "verification" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Seller Verification</h3>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p className="cinzel" style={{ fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{seller.name}</p>
                <p style={{ color: "var(--text2)", fontSize: 12 }}>License: {seller.licenseNo}</p>
              </div>
              <Badge status={seller.status}/>
            </div>
            <Divider label="SUBMITTED DOCUMENTS"/>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {seller.docs.map(doc => (
                <div key={doc} style={{ background: "var(--surface2)", borderRadius: 6, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text2)", fontSize: 13 }}>📄 {doc}</span>
                  <span style={{ color: "#4ade80", fontSize: 12 }}>Uploaded</span>
                </div>
              ))}
            </div>
            <Btn size="sm" variant="ghost" onClick={() => setDocModal(true)}>+ Upload Additional Document</Btn>
          </div>
        </div>
      )}

      {/* Add Gem Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Gemstone">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["name", "Gemstone Name", "text"], ["origin", "Origin (Country/Region)", "text"], ["weight", "Weight (e.g. 2.5 ct)", "text"], ["certNo", "Certification Number", "text"]].map(([k, p]) => (
            <div key={k}>
              <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 4 }}>{p}</label>
              <input placeholder={p} value={newGem[k]} onChange={e => setNewGem(g => ({ ...g, [k]: e.target.value }))}/>
            </div>
          ))}
          <div>
            <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 4 }}>Type</label>
            <select value={newGem.type} onChange={e => setNewGem(g => ({ ...g, type: e.target.value }))}>
              {["Sapphire","Ruby","Emerald","Alexandrite","Padparadscha","Spinel","Tourmaline","Garnet"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 4 }}>Certification Body</label>
            <select value={newGem.certification} onChange={e => setNewGem(g => ({ ...g, certification: e.target.value }))}>
              {["GIA","Gübelin","AGL","GRS","SSEF","IGI"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 4 }}>Description</label>
            <textarea placeholder="Describe the gemstone…" value={newGem.description} onChange={e => setNewGem(g => ({ ...g, description: e.target.value }))} rows={3}/>
          </div>
          <div style={{ background: "#1a1200", border: "1px solid var(--gold-dim)", borderRadius: 8, padding: 12 }}>
            <p style={{ color: "var(--gold)", fontSize: 12 }}>ℹ️ Your listing will be reviewed by the Authority before being published to buyers.</p>
          </div>
          <Btn onClick={() => {
            if (!newGem.name || !newGem.origin) return toast("Please fill all required fields.");
            onAddGem({ ...newGem, sellerId: seller.id });
            setAddModal(false);
            setNewGem({ name: "", origin: "", type: "Sapphire", weight: "", certification: "GIA", certNo: "", description: "" });
            toast("Gemstone submitted for admin approval!");
          }}>Submit for Approval</Btn>
        </div>
      </Modal>

      {/* Set Price Modal */}
      <Modal open={!!priceModal} onClose={() => setPriceModal(null)} title="Set Selling Price">
        {priceModal && (
          <div>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
              Set your price for <strong style={{ color: "var(--text)" }}>{gems.find(g => g.id === priceModal.gemId)?.name}</strong> requested by <strong style={{ color: "var(--gold)" }}>{priceModal.buyerName}</strong>
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 6 }}>Selling Price (USD)</label>
              <input type="number" placeholder="e.g. 8500" value={price} onChange={e => setPrice(e.target.value)} style={{ fontSize: 18 }}/>
            </div>
            <div style={{ background: "#1a1200", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ color: "var(--gold)", fontSize: 12 }}>ℹ️ The Authority will add their commission on top of this price. Final price will be communicated to the buyer.</p>
            </div>
            <Btn style={{ width: "100%" }} onClick={() => {
              if (!price || isNaN(Number(price))) return toast("Please enter a valid price.");
              onPriceRequest("price", priceModal.id, Number(price));
              setPriceModal(null);
              toast("Price sent to buyer for acceptance!");
            }}>Send Price Offer to Buyer</Btn>
          </div>
        )}
      </Modal>

      {/* Doc Upload Modal */}
      <Modal open={docModal} onClose={() => setDocModal(false)} title="Upload Document">
        <div>
          <div style={{ border: "2px dashed var(--border)", borderRadius: 10, padding: 40, textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📄</p>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>Drag and drop or click to upload</p>
            <p style={{ color: "var(--text3)", fontSize: 12 }}>PDF, JPG, PNG accepted</p>
          </div>
          <input placeholder="Document name (e.g. updated_license.pdf)" value={docFile} onChange={e => setDocFile(e.target.value)} style={{ marginBottom: 12 }}/>
          <Btn style={{ width: "100%" }} onClick={() => { setDocModal(false); toast("Document uploaded successfully!"); }}>Upload Document</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────
const AdminDashboard = ({ gems, sellers, requests, onApproveSeller, onRejectSeller, onApproveGem, onRejectGem, onApproveTransaction, onRejectTransaction, onSetCommission, toast }) => {
  const [view, setView] = useState("overview");
  const [commissionModal, setCommissionModal] = useState(null);
  const [commission, setCommission] = useState("8");
  const [rejectModal, setRejectModal] = useState(null);

  const pendingSellers = sellers.filter(s => s.status === "pending");
  const pendingGems = gems.filter(g => g.adminStatus === "pending");
  const pendingTransactions = requests.filter(r => r.status === "buyer_accepted");
  const allTransactions = requests.filter(r => ["buyer_accepted","admin_approved","rejected","delivered"].includes(r.status));

  const navItems = [
    ["overview", "Overview"],
    ["sellers", `Seller Approvals (${pendingSellers.length})`],
    ["gemstones", `Gemstone Review (${pendingGems.length})`],
    ["transactions", `Transactions (${pendingTransactions.length})`],
    ["commission", "Commission Tracker"],
  ];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 6, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 16, flexWrap: "wrap" }}>
        {navItems.map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "var(--surface2)" : "none", border: view === v ? "1px solid var(--gold)" : "1px solid transparent", color: view === v ? "var(--gold)" : "var(--text2)", borderRadius: 20, padding: "7px 18px", fontSize: 13, cursor: "pointer", transition: "all .2s", position: "relative" }}>
            {l}
            {v !== "overview" && v !== "commission" && (v === "sellers" ? pendingSellers : v === "gemstones" ? pendingGems : pendingTransactions).length > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#f87171", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(v === "sellers" ? pendingSellers : v === "gemstones" ? pendingGems : pendingTransactions).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h3 className="cormorant" style={{ fontSize: 24, color: "var(--gold)" }}>Authority Dashboard</h3>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>National Gem & Jewellery Authority — Administrative Panel</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, marginBottom: 28 }}>
            {[
              ["Pending Sellers", pendingSellers.length, "#fbbf24"],
              ["Pending Gems", pendingGems.length, "#60a5fa"],
              ["Active Transactions", pendingTransactions.length, "#c084fc"],
              ["Total Sellers", sellers.filter(s => s.status === "verified").length, "#4ade80"],
              ["Listed Gems", gems.filter(g => g.adminStatus === "approved").length, "#4ade80"],
              ["Completed", requests.filter(r => r.status === "delivered").length, "#86efac"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
                <p style={{ color: "var(--text3)", fontSize: 12, marginBottom: 6 }}>{label}</p>
                <p style={{ color, fontSize: 28, fontWeight: 700 }}>{val}</p>
              </div>
            ))}
          </div>
          {(pendingSellers.length > 0 || pendingGems.length > 0 || pendingTransactions.length > 0) && (
            <div style={{ background: "#2a1200", border: "1px solid #fbbf2444", borderRadius: 10, padding: 16 }}>
              <p style={{ color: "#fbbf24", fontSize: 13, marginBottom: 10, fontWeight: 500 }}>⚠️ Pending Actions Required</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {pendingSellers.length > 0 && <p style={{ color: "var(--text2)", fontSize: 12 }}>→ {pendingSellers.length} seller(s) awaiting verification</p>}
                {pendingGems.length > 0 && <p style={{ color: "var(--text2)", fontSize: 12 }}>→ {pendingGems.length} gemstone(s) awaiting approval</p>}
                {pendingTransactions.length > 0 && <p style={{ color: "var(--text2)", fontSize: 12 }}>→ {pendingTransactions.length} transaction(s) awaiting approval</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "sellers" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Seller Verification Requests</h3>
          {sellers.length === 0 ? <p style={{ color: "var(--text3)" }}>No sellers to review.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sellers.map(seller => (
                <div key={seller.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                    <div>
                      <h4 className="cinzel" style={{ fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{seller.name}</h4>
                      <p style={{ color: "var(--text2)", fontSize: 12 }}>{seller.email} · {seller.phone}</p>
                      <p style={{ color: "var(--text3)", fontSize: 12 }}>License: {seller.licenseNo} · Joined {seller.joinedAt}</p>
                    </div>
                    <Badge status={seller.status}/>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ color: "var(--text3)", fontSize: 12, marginBottom: 8 }}>SUBMITTED DOCUMENTS</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {seller.docs.map(doc => (
                        <span key={doc} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "var(--text2)" }}>📄 {doc}</span>
                      ))}
                    </div>
                  </div>
                  {seller.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn size="sm" variant="success" onClick={() => { onApproveSeller(seller.id); toast(`${seller.name} has been verified!`); }}>✓ Verify Seller</Btn>
                      <Btn size="sm" variant="danger" onClick={() => { onRejectSeller(seller.id); toast(`${seller.name} verification rejected.`); }}>✕ Reject</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "gemstones" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Gemstone Approval Queue</h3>
          {gems.length === 0 ? <p style={{ color: "var(--text3)" }}>No gemstones to review.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {gems.map(gem => {
                const seller = sellers.find(s => s.id === gem.sellerId);
                return (
                  <div key={gem.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                      <GemIcon type={gem.img} size={60}/>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h4 className="cormorant" style={{ fontSize: 19, color: "var(--text)" }}>{gem.name}</h4>
                          <Badge status={gem.adminStatus}/>
                        </div>
                        <p style={{ color: "var(--text2)", fontSize: 12, marginTop: 2 }}>{gem.origin} · {gem.weight} · {gem.certification} #{gem.certNo}</p>
                        <p style={{ color: "var(--text2)", fontSize: 12 }}>Seller: <strong>{seller?.name}</strong></p>
                        <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{gem.description}</p>
                      </div>
                    </div>
                    {gem.adminStatus === "pending" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                        <Btn size="sm" variant="success" onClick={() => { onApproveGem(gem.id); toast(`"${gem.name}" approved and listed!`); }}>✓ Approve Listing</Btn>
                        <Btn size="sm" variant="danger" onClick={() => { onRejectGem(gem.id); toast(`"${gem.name}" rejected.`); }}>✕ Reject</Btn>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === "transactions" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Transaction Approvals</h3>
          {requests.length === 0 ? <p style={{ color: "var(--text3)" }}>No transactions to review.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {requests.map(req => {
                const gem = gems.find(g => g.id === req.gemId);
                const seller = sellers.find(s => s.id === gem?.sellerId);
                const commAmt = req.sellerPrice && req.commission ? Math.round(req.sellerPrice * req.commission / 100) : 0;
                const finalPrice = req.sellerPrice ? req.sellerPrice + commAmt : null;
                return (
                  <div key={req.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 14 }}>
                      {[
                        ["Buyer", req.buyerName],
                        ["Seller", seller?.name || "—"],
                        ["Gemstone", gem?.name || "—"],
                        ["Seller Price", req.sellerPrice ? `USD ${req.sellerPrice.toLocaleString()}` : "—"],
                        ["Commission", req.commission ? `${req.commission}%` : "—"],
                        ["Final Price", finalPrice ? `USD ${finalPrice.toLocaleString()}` : "—"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ background: "var(--surface2)", borderRadius: 6, padding: "10px 14px" }}>
                          <p style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>{k}</p>
                          <p style={{ color: "var(--gold)", fontSize: 13 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <Badge status={req.status}/>
                      {req.status === "buyer_accepted" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn size="sm" variant="ghost" onClick={() => { setCommissionModal(req); setCommission(req.commission?.toString() || "8"); }}>Set Commission</Btn>
                          <Btn size="sm" variant="success" onClick={() => { onApproveTransaction(req.id); toast("Transaction approved! Seller notified to deliver."); }}>✓ Approve</Btn>
                          <Btn size="sm" variant="danger" onClick={() => { onRejectTransaction(req.id); toast("Transaction rejected."); }}>✕ Reject</Btn>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === "commission" && (
        <div>
          <h3 className="cormorant" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 20 }}>Commission Tracker</h3>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 0, background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "10px 16px" }}>
              {["Gemstone","Buyer","Seller Price","Commission","Final","Status"].map(h => (
                <span key={h} style={{ color: "var(--text3)", fontSize: 11, letterSpacing: "0.08em" }}>{h}</span>
              ))}
            </div>
            {requests.filter(r => r.sellerPrice).length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 13 }}>No completed transactions yet.</div>
            ) : requests.filter(r => r.sellerPrice).map(req => {
              const gem = gems.find(g => g.id === req.gemId);
              const commAmt = req.sellerPrice && req.commission ? Math.round(req.sellerPrice * req.commission / 100) : 0;
              return (
                <div key={req.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 0, padding: "12px 16px", borderBottom: "1px solid var(--border2)", alignItems: "center" }}>
                  <span className="cormorant" style={{ fontSize: 15, color: "var(--text)" }}>{gem?.name}</span>
                  <span style={{ color: "var(--text2)", fontSize: 12 }}>{req.buyerName}</span>
                  <span style={{ color: "var(--text)", fontSize: 13 }}>USD {req.sellerPrice?.toLocaleString()}</span>
                  <span style={{ color: "#fbbf24", fontSize: 13 }}>{req.commission ? `${req.commission}% (${commAmt})` : "—"}</span>
                  <span style={{ color: "var(--gold)", fontSize: 13 }}>{req.sellerPrice && req.commission ? `USD ${(req.sellerPrice + commAmt).toLocaleString()}` : "—"}</span>
                  <Badge status={req.status}/>
                </div>
              );
            })}
            {requests.filter(r => r.sellerPrice && r.commission).length > 0 && (
              <div style={{ padding: "14px 16px", background: "var(--surface2)", display: "flex", justifyContent: "flex-end", gap: 32 }}>
                <span style={{ color: "var(--text3)", fontSize: 13 }}>Total Authority Commission:</span>
                <span style={{ color: "var(--gold)", fontSize: 15, fontWeight: 600 }}>
                  USD {requests.filter(r => r.sellerPrice && r.commission).reduce((sum, r) => sum + Math.round(r.sellerPrice * r.commission / 100), 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commission Modal */}
      <Modal open={!!commissionModal} onClose={() => setCommissionModal(null)} title="Set Authority Commission">
        {commissionModal && (() => {
          const gem = gems.find(g => g.id === commissionModal.gemId);
          const commAmt = commissionModal.sellerPrice ? Math.round(commissionModal.sellerPrice * Number(commission) / 100) : 0;
          return (
            <div>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>Setting commission for <strong style={{ color: "var(--text)" }}>{gem?.name}</strong></p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14 }}>
                  <p style={{ color: "var(--text3)", fontSize: 12 }}>Seller Price</p>
                  <p style={{ color: "var(--gold)", fontSize: 18 }}>USD {commissionModal.sellerPrice?.toLocaleString()}</p>
                </div>
                <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14 }}>
                  <p style={{ color: "var(--text3)", fontSize: 12 }}>Authority Fee</p>
                  <p style={{ color: "#fbbf24", fontSize: 18 }}>USD {commAmt.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "var(--text2)", fontSize: 12, display: "block", marginBottom: 6 }}>Commission Percentage (%)</label>
                <input type="number" value={commission} onChange={e => setCommission(e.target.value)} min="0" max="50" style={{ fontSize: 18 }}/>
              </div>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <p style={{ color: "var(--text3)", fontSize: 12, marginBottom: 4 }}>Final Price to Buyer</p>
                <p style={{ color: "var(--gold2)", fontSize: 22, fontWeight: 600 }}>USD {(commissionModal.sellerPrice + commAmt).toLocaleString()}</p>
              </div>
              <Btn style={{ width: "100%" }} onClick={() => {
                onSetCommission(commissionModal.id, Number(commission));
                setCommissionModal(null);
                toast(`Commission set to ${commission}%`);
              }}>Save Commission</Btn>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState("buyer");
  const [activeSeller, setActiveSeller] = useState(SELLERS_SEED[0]);
  const [gems, setGems] = useState(GEMS_SEED);
  const [sellers, setSellers] = useState(SELLERS_SEED);
  const [requests, setRequests] = useState(REQUESTS_SEED);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg) => setToastMsg(msg);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleRequestBuy = (action, id, extra) => {
    if (action === "new") {
      const newReq = {
        id: `r${Date.now()}`, buyerName: "Amara Silva", buyerId: "b1",
        gemId: id, status: "pending_seller", sellerPrice: null, commission: null,
        requestedAt: new Date().toISOString().split("T")[0], note: extra || ""
      };
      setRequests(r => [...r, newReq]);
    } else if (action === "accept") {
      setRequests(r => r.map(req => req.id === id ? { ...req, status: "buyer_accepted" } : req));
    } else if (action === "reject_buyer") {
      setRequests(r => r.map(req => req.id === id ? { ...req, status: "rejected" } : req));
    }
  };

  const handleSellerPrice = (action, id, price) => {
    if (action === "price") {
      setRequests(r => r.map(req => req.id === id ? { ...req, status: "price_offered", sellerPrice: price, commission: 8 } : req));
    } else if (action === "deliver") {
      setRequests(r => r.map(req => req.id === id ? { ...req, status: "delivered" } : req));
    }
  };

  const handleRejectRequest = (id) => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: "rejected" } : req));
  };

  const handleAddGem = (gemData) => {
    const newGem = {
      ...gemData, id: `g${Date.now()}`, adminStatus: "pending",
      listedAt: new Date().toISOString().split("T")[0],
      img: gemData.type?.toLowerCase().replace(" ", "") || "default"
    };
    setGems(g => [...g, newGem]);
  };

  const handleApproveSeller = (id) => setSellers(s => s.map(seller => seller.id === id ? { ...seller, status: "verified" } : seller));
  const handleRejectSeller = (id) => setSellers(s => s.map(seller => seller.id === id ? { ...seller, status: "rejected" } : seller));
  const handleApproveGem = (id) => setGems(g => g.map(gem => gem.id === id ? { ...gem, adminStatus: "approved" } : gem));
  const handleRejectGem = (id) => setGems(g => g.map(gem => gem.id === id ? { ...gem, adminStatus: "rejected" } : gem));
  const handleApproveTransaction = (id) => setRequests(r => r.map(req => req.id === id ? { ...req, status: "admin_approved" } : req));
  const handleRejectTransaction = (id) => setRequests(r => r.map(req => req.id === id ? { ...req, status: "rejected" } : req));
  const handleSetCommission = (id, comm) => setRequests(r => r.map(req => req.id === id ? { ...req, commission: comm } : req));

  const pendingAdminActions = sellers.filter(s => s.status === "pending").length + gems.filter(g => g.adminStatus === "pending").length + requests.filter(r => r.status === "buyer_accepted").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Background texture */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(200,169,110,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(74,111,165,0.05) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 }}/>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,7,13,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#b8922e,#c8a96e)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GemIcon type="sapphire" size={24}/>
            </div>
            <div>
              <h1 className="cinzel" style={{ fontSize: 14, color: "var(--gold)", letterSpacing: "0.12em", lineHeight: 1.1 }}>GEMTRADE</h1>
              <p style={{ color: "var(--text3)", fontSize: 9, letterSpacing: "0.15em" }}>NATIONAL GEM & JEWELLERY AUTHORITY</p>
            </div>
          </div>

          {/* Role switcher */}
          <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: 3, gap: 2 }}>
            {[
              ["buyer", "Buyer"],
              ["seller", "Seller"],
              ["admin", "Authority"],
            ].map(([r, l]) => (
              <button key={r} onClick={() => setRole(r)} style={{ background: role === r ? "linear-gradient(135deg,#b8922e,#c8a96e)" : "transparent", color: role === r ? "#1a1200" : "var(--text2)", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: role === r ? 600 : 400, transition: "all .2s", cursor: "pointer", position: "relative" }}>
                {l}
                {r === "admin" && pendingAdminActions > 0 && (
                  <span style={{ position: "absolute", top: -3, right: -3, background: "#f87171", color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>{pendingAdminActions}</span>
                )}
              </button>
            ))}
          </div>

          {/* Seller switch if seller role */}
          {role === "seller" && (
            <select value={activeSeller.id} onChange={e => setActiveSeller(sellers.find(s => s.id === e.target.value))} style={{ width: "auto", fontSize: 12, padding: "6px 12px" }}>
              {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <span style={{ color: "var(--text3)", fontSize: 12, letterSpacing: "0.08em" }}>
            {role === "buyer" ? "BUYER PORTAL" : role === "seller" ? "SELLER PORTAL" : "AUTHORITY PANEL"}
          </span>
          {role === "seller" && (
            <>
              <span style={{ color: "var(--text3)" }}>·</span>
              <span style={{ color: "var(--gold)", fontSize: 12 }}>{activeSeller.name}</span>
              <Badge status={activeSeller.status}/>
            </>
          )}
        </div>

        {/* Workflow Banner */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, padding: "12px 20px", marginBottom: 28, overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", minWidth: "max-content" }}>
            {[
              ["Seller Verified", role === "seller"],
              ["Gem Listed", false],
              ["Admin Approves Gem", false],
              ["Buyer Requests", role === "buyer"],
              ["Seller Sets Price", role === "seller"],
              ["Buyer Accepts", role === "buyer"],
              ["Admin Approves", role === "admin"],
              ["Delivery", false],
            ].map(([step, active], i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: active ? "var(--gold)" : "var(--surface2)", border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`, color: active ? "#1a1200" : "var(--text3)", borderRadius: 14, padding: "3px 12px", fontSize: 11, fontWeight: active ? 600 : 400, transition: "all .3s" }}>
                  {step}
                </div>
                {i < 7 && <span style={{ color: "var(--text3)", fontSize: 12 }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {role === "buyer" && (
          <BuyerDashboard gems={gems} requests={requests} sellers={sellers} onRequestBuy={handleRequestBuy} toast={toast}/>
        )}
        {role === "seller" && (
          <SellerDashboard seller={activeSeller} gems={gems} requests={requests} onAddGem={handleAddGem} onPriceRequest={handleSellerPrice} onRejectRequest={handleRejectRequest} toast={toast}/>
        )}
        {role === "admin" && (
          <AdminDashboard gems={gems} sellers={sellers} requests={requests} onApproveSeller={handleApproveSeller} onRejectSeller={handleRejectSeller} onApproveGem={handleApproveGem} onRejectGem={handleRejectGem} onApproveTransaction={handleApproveTransaction} onRejectTransaction={handleRejectTransaction} onSetCommission={handleSetCommission} toast={toast}/>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border2)", padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <p className="cinzel" style={{ color: "var(--text3)", fontSize: 10, letterSpacing: "0.2em" }}>NATIONAL GEM & JEWELLERY AUTHORITY OF SRI LANKA · GEMTRADE PLATFORM</p>
      </footer>

      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)}/>}
    </div>
  );
}
