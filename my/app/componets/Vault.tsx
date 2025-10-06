// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Clipboard, Edit2, Trash2, Save } from "lucide-react";

// // ⚙️ Utility for Crypto
// const cryptoUtil = {
//   randomBytes: (size: number) => new Uint8Array(size).map(() => Math.floor(Math.random() * 256)),
//   deriveKey: async (password: string, salt: Uint8Array) => {
//     const enc = new TextEncoder();
//     const keyMat = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
//     return await crypto.subtle.deriveKey(
//       { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
//       keyMat,
//       { name: "AES-GCM", length: 256 },
//       true,
//       ["encrypt", "decrypt"]
//     );
//   },
//   encryptJSON: async (key: CryptoKey, data: any) => {
//     const iv = crypto.getRandomValues(new Uint8Array(12));
//     const encoded = new TextEncoder().encode(JSON.stringify(data));
//     const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
//     const combined = new Uint8Array(iv.length + encrypted.byteLength);
//     combined.set(iv);
//     combined.set(new Uint8Array(encrypted), iv.length);
//     return btoa(String.fromCharCode(...combined));
//   },
//   decryptJSON: async (key: CryptoKey, blob: string) => {
//     try {
//       const bytes = Uint8Array.from(atob(blob), (c) => c.charCodeAt(0));
//       const iv = bytes.slice(0, 12);
//       const encrypted = bytes.slice(12);
//       const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
//       return JSON.parse(new TextDecoder().decode(decrypted));
//     } catch {
//       return [];
//     }
//   },
// };

// const { randomBytes, deriveKey, encryptJSON, decryptJSON } = cryptoUtil;

// type Item = {
//   id: string;
//   title: string;
//   username?: string;
//   password?: string;
//   url?: string;
//   notes?: string;
// };

// export default function Vault({ quickAddPassword }: { quickAddPassword: string }) {
//   const [items, setItems] = useState<Item[]>([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [editValues, setEditValues] = useState<{ title: string; username: string }>({ title: "", username: "" });

//   const API_URL = "http://localhost:5000";
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

//   useEffect(() => {
//     if (token) loadVault();
//   }, [token]);

//   async function loadVault() {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_URL}/api/vault`, { headers: { Authorization: `Bearer ${token}` } });
//       const { salt, blob } = res.data.vault || {};
//       if (!salt || !blob) return setItems([]);
//       const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
//       const key = await deriveKey(token, saltBytes);
//       const decrypted = await decryptJSON(key, blob);
//       setItems(decrypted);
//     } catch (err) {
//       console.error("Vault load failed:", err);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function saveVault(newItems: Item[]) {
//     try {
//       const salt = randomBytes(16);
//       const key = await deriveKey(token, salt);
//       const blob = await encryptJSON(key, newItems);
//       const saltBase64 = btoa(String.fromCharCode(...salt));
//       await axios.put(`${API_URL}/api/vault`, { salt: saltBase64, blob }, { headers: { Authorization: `Bearer ${token}` } });
//       setItems(newItems);
//     } catch (err) {
//       console.error("Vault save failed:", err);
//     }
//   }

//   async function handleQuickAdd() {
//     const title = (document.getElementById("qtitle") as HTMLInputElement)?.value.trim() || "Untitled";
//     const username = (document.getElementById("quser") as HTMLInputElement)?.value.trim() || "";

//     const newItem: Item = { id: crypto.randomUUID(), title, username, password: quickAddPassword };
//     await saveVault([...items, newItem]);
//     loadVault();
//   }

//   async function handleCopy(id: string, text: string) {
//     await navigator.clipboard.writeText(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 2000);
//   }

//   function startEdit(item: Item) {
//     setEditId(item.id);
//     setEditValues({ title: item.title, username: item.username || "" });
//   }

//   async function confirmEdit(id: string) {
//     const updated = items.map((i) =>
//       i.id === id ? { ...i, title: editValues.title, username: editValues.username } : i
//     );
//     await saveVault(updated);
//     setEditId(null);
//     loadVault();
//   }

//   async function handleDelete(id: string) {
//     await saveVault(items.filter((i) => i.id !== id));
//     loadVault();
//   }

//   const filtered = useMemo(
//     () =>
//       items.filter(
//         (i) =>
//           i.title.toLowerCase().includes(query.toLowerCase()) ||
//           (i.username || "").toLowerCase().includes(query.toLowerCase())
//       ),
//     [items, query]
//   );

//   return (
//     <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl  mt-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🔐 Secure Password Vault</h2>

//       <div className="flex flex-col sm:flex-row gap-2 mb-4">
//         <input id="qtitle" placeholder="Title" className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
//         <input id="quser" placeholder="Username" className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
//         <button
//           onClick={handleQuickAdd}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
//         >
//           + Add
//         </button>
//       </div>

//       <input
//         placeholder="Search..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-indigo-500"
//       />

//       {loading ? (
//         <div className="text-center text-gray-500 animate-pulse py-6">Loading your vault...</div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center text-gray-400 py-8 text-sm">No items found — add your first password!</div>
//       ) : (
//         <div className="space-y-3">
//           <AnimatePresence>
//             {filtered.map((i) => (
//               <motion.div
//                 key={i.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
//               >
//                 {editId === i.id ? (
//                   <div className="flex-1 mr-3">
//                     <input
//                       value={editValues.title}
//                       onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
//                       className="w-full p-1 mb-1 border rounded-md text-sm"
//                     />
//                     <input
//                       value={editValues.username}
//                       onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
//                       className="w-full p-1 border rounded-md text-sm"
//                     />
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="font-semibold text-gray-800">{i.title}</div>
//                     <div className="text-sm text-gray-500">{i.username}</div>
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   {editId === i.id ? (
//                     <button
//                       onClick={() => confirmEdit(i.id)}
//                       className="p-2 bg-green-100 hover:bg-green-200 rounded-md"
//                       title="Save"
//                     >
//                       <Save className="w-4 h-4 text-green-700" />
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => handleCopy(i.id, i.password || "")}
//                         className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
//                         title="Copy Password"
//                       >
//                         {copiedId === i.id ? (
//                           <span className="text-xs text-green-600 font-medium">Copied!</span>
//                         ) : (
//                           <Clipboard className="w-4 h-4 text-gray-600" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => startEdit(i)}
//                         className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md"
//                         title="Edit"
//                       >
//                         <Edit2 className="w-4 h-4 text-yellow-700" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(i.id)}
//                         className="p-2 bg-red-100 hover:bg-red-200 rounded-md"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-600" />
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, Edit2, Trash2, Save } from "lucide-react";

/**
 * Vault component:
 * - Displays saved items (title, username, password, url, notes)
 * - Client-side encryption before sending to server (server stores salt + blob)
 * - Copy with auto-clear (15s)
 * - Inline edit, delete
 * - Search/filter
 * - Toast notifications & animated cards
 */

/* --- crypto utilities (client side only) --- */
const cryptoUtil = {
  randomBytes: (size: number) => new Uint8Array(size).map(() => Math.floor(Math.random() * 256)),
  deriveKey: async (passphrase: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMat = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMat, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  },
  encryptJSON: async (key: CryptoKey, data: any) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  },
  decryptJSON: async (key: CryptoKey, blob: string) => {
    const bytes = Uint8Array.from(atob(blob), (c) => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const encrypted = bytes.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
    return JSON.parse(new TextDecoder().decode(decrypted));
  },
};

type Item = {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
};

export default function Vault({ quickAddPassword }: { quickAddPassword: string }) {
  const API_URL = "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyClearTimer, setCopyClearTimer] = useState<number | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Item>>({});
  const [toast, setToast] = useState<string | null>(null);

  // helper notifications
  function showToast(msg: string, ms = 2000) {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }

  // load vault on mount
  useEffect(() => {
    if (token) loadVault();
  }, [token]);

  async function loadVault() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/vault`, { headers: { Authorization: `Bearer ${token}` } });
      const { salt, blob } = res.data.vault || {};
      if (!salt || !blob) {
        setItems([]);
        return;
      }
      const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
      const key = await cryptoUtil.deriveKey(token, saltBytes);
      const decrypted = await cryptoUtil.decryptJSON(key, blob);
      setItems(Array.isArray(decrypted) ? decrypted : []);
    } catch (err) {
      console.error("Vault load failed", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveVault(newItems: Item[]) {
    try {
      const salt = cryptoUtil.randomBytes(16);
      const key = await cryptoUtil.deriveKey(token, salt);
      const blob = await cryptoUtil.encryptJSON(key, newItems);
      const saltBase64 = btoa(String.fromCharCode(...salt));
      await axios.put(`${API_URL}/api/vault`, { salt: saltBase64, blob }, { headers: { Authorization: `Bearer ${token}` } });
      setItems(newItems);
      showToast("Saved");
    } catch (err) {
      console.error("Vault save failed", err);
      showToast("Save error");
    }
  }

  async function handleQuickAdd() {
    const title = (document.getElementById("qtitle") as HTMLInputElement)?.value.trim() || "Untitled";
    const username = (document.getElementById("quser") as HTMLInputElement)?.value.trim() || "";
    const newItem: Item = { id: crypto.randomUUID(), title, username, password: quickAddPassword || "" };
    await saveVault([...items, newItem]);
    document.getElementById("qtitle") && ((document.getElementById("qtitle") as HTMLInputElement).value = "");
    document.getElementById("quser") && ((document.getElementById("quser") as HTMLInputElement).value = "");
  }

  // copy with auto-clear (15s)
  async function handleCopy(id: string, text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast("Copied to clipboard (will clear in 15s)");
      if (copyClearTimer) window.clearTimeout(copyClearTimer);
      const t = window.setTimeout(async () => {
        try { await navigator.clipboard.writeText(""); } catch {}
        setCopiedId(null);
      }, 15000);
      setCopyClearTimer(t);
    } catch (err) {
      console.error("Copy failed", err);
      showToast("Copy failed");
    }
  }

  function startEdit(item: Item) {
    setEditId(item.id);
    setEditValues({ title: item.title, username: item.username, url: item.url, notes: item.notes });
  }

  async function confirmEdit(id: string) {
    const updated = items.map((i) => (i.id === id ? { ...i, ...editValues } : i));
    await saveVault(updated);
    setEditId(null);
  }

  async function handleDelete(id: string) {
    await saveVault(items.filter((i) => i.id !== id));
  }

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          (i.username || "").toLowerCase().includes(query.toLowerCase()) ||
          (i.url || "").toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-800/60 rounded-lg shadow-sm border">
      {/* toast */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <input id="qtitle" placeholder="Title" className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 bg-white/60 dark:bg-gray-700 text-sm" />
          <input id="quser" placeholder="Username" className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 bg-white/60 dark:bg-gray-700 text-sm" />
          <button onClick={handleQuickAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">+ Add</button>
        </div>

        {toast ? (
          <div className="absolute right-0 top-0 bg-black/80 text-white text-xs px-3 py-1 rounded">{toast}</div>
        ) : null}
      </div>

      <input
        placeholder="Search by title, username, url..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 bg-white/60 dark:bg-gray-700 text-sm"
      />

      {loading ? (
        <div className="text-center text-gray-500 py-6 animate-pulse">Loading vault...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No items — add your first password</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((it) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white dark:bg-gray-900 border rounded-lg shadow-sm p-3 flex items-center justify-between gap-4"
              >
                {editId === it.id ? (
                  <div className="flex-1 mr-3 space-y-2">
                    <input className="w-full p-2 border rounded text-sm bg-white/60 dark:bg-gray-800" value={editValues.title || ""} onChange={(e) => setEditValues(v => ({ ...v, title: e.target.value }))} />
                    <input className="w-full p-2 border rounded text-sm bg-white/60 dark:bg-gray-800" value={editValues.username || ""} onChange={(e) => setEditValues(v => ({ ...v, username: e.target.value }))} />
                    <input className="w-full p-2 border rounded text-sm bg-white/60 dark:bg-gray-800" value={editValues.url || ""} onChange={(e) => setEditValues(v => ({ ...v, url: e.target.value }))} placeholder="URL (optional)" />
                    <textarea className="w-full p-2 border rounded text-sm bg-white/60 dark:bg-gray-800" value={editValues.notes || ""} onChange={(e) => setEditValues(v => ({ ...v, notes: e.target.value }))} placeholder="Notes (optional)" />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{it.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{it.username}{it.url ? ` • ${it.url}` : ""}</div>
                    {it.notes ? <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{it.notes}</div> : null}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {editId === it.id ? (
                    <button onClick={() => confirmEdit(it.id)} className="p-2 bg-green-100 hover:bg-green-200 rounded-md" title="Save"><Save className="w-4 h-4 text-green-700" /></button>
                  ) : (
                    <>
                      <button onClick={() => handleCopy(it.id, it.password || "")} title="Copy password" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                        {copiedId === it.id ? <span className="text-xs text-green-600">Copied</span> : <Clipboard className="w-4 h-4 text-gray-600" />}
                      </button>
                      <button onClick={() => startEdit(it)} title="Edit" className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md">
                        <Edit2 className="w-4 h-4 text-yellow-700" />
                      </button>
                      <button onClick={() => handleDelete(it.id)} title="Delete" className="p-2 bg-red-100 hover:bg-red-200 rounded-md">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
