 

// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import PasswordGenerator from "./PasswordGenerator";
// import Vault from "./Vault";
// import { Sun, Moon } from "lucide-react";

// export default function Home() {
//   const API_URL = "http://localhost:5000";
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [signed, setSigned] = useState(false);
//   const [token, setToken] = useState("");
//   const [generated, setGenerated] = useState("");
//   const [dark, setDark] = useState(false);

//   // 🔧 Properly initialize dark mode on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("dark") === "1";
//     setDark(savedTheme);
//     document.documentElement.classList.toggle("dark", savedTheme);
//   }, []);

//   // 🔁 Keep token/email synced
//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     const e = localStorage.getItem("email");
//     if (t && e) {
//       setToken(t);
//       setEmail(e);
//       setSigned(true);
//     }
//   }, []);

//   // 🌗 Toggle dark mode
//   function toggleDark() {
//     const next = !dark;
//     setDark(next);
//     localStorage.setItem("dark", next ? "1" : "0");
//     document.documentElement.classList.toggle("dark", next);
//   }

//   async function handleSignup() {
//     try {
//       const res = await axios.post(`${API_URL}/api/auth/signup`, { email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("email", user.email);
//       setToken(token);
//       setSigned(true);
//       setPassword("");
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Signup failed");
//     }
//   }

//   async function handleLogin() {
//     try {
//       const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("email", user.email);
//       setToken(token);
//       setSigned(true);
//       setPassword("");
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Login failed");
//     }
//   }

//   function handleLogout() {
//     setEmail("");
//     setPassword("");
//     setToken("");
//     setSigned(false);
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//   }

//   return (
//     <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
//       <div className="mx-auto max-w-5xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             Vault — Minimal & Private
//           </h1>
//           <div className="flex items-center gap-3">
//             {/* Toggle button */}
//             <button
//               onClick={toggleDark}
//               className="p-2 rounded bg-white/70 dark:bg-gray-700 hover:scale-105 transition-transform"
//             >
//               {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
//             </button>
//             {signed && (
//               <div className="text-sm text-gray-600 dark:text-gray-300">
//                 Signed in: {email}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Auth or Vault UI */}
//         {!signed ? (
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow">
//               <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Sign up / Sign in</h2>
//               <input
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-3 border rounded mb-3 bg-white/60 dark:bg-gray-700 dark:text-white"
//               />
//               <input
//                 placeholder="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3 border rounded mb-4 bg-white/60 dark:bg-gray-700 dark:text-white"
//               />
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleLogin}
//                   disabled={!email || !password}
//                   className="flex-1 bg-indigo-600 text-white rounded p-3 hover:bg-indigo-700"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={handleSignup}
//                   disabled={!email || !password}
//                   className="flex-1 bg-green-600 text-white rounded p-3 hover:bg-green-700"
//                 >
//                   Sign up
//                 </button>
//               </div>
//             </div>

//             <PasswordGenerator onGenerated={setGenerated} />
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <div className="text-sm text-gray-700 dark:text-gray-300">
//                 Welcome, <span className="font-medium">{email}</span>
//               </div>
//               <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
//                 Logout
//               </button>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <PasswordGenerator onGenerated={setGenerated} />
//               <Vault quickAddPassword={generated} />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PasswordGenerator from "./PasswordGenerator";
import Vault from "./Vault";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const API_URL = "http://localhost:5000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signed, setSigned] = useState(false);
  const [token, setToken] = useState("");
  const [generated, setGenerated] = useState("");
  const [dark, setDark] = useState(false);

  // ✅ Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  // 🌗 Toggle dark mode
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  // 🔁 Sync token & email from localStorage
  useEffect(() => {
    const t = localStorage.getItem("token");
    const e = localStorage.getItem("email");
    if (t && e) {
      setToken(t);
      setEmail(e);
      setSigned(true);
    }
  }, []);

  async function handleSignup() {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);
      setToken(token);
      setSigned(true);
      setPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  }

  async function handleLogin() {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);
      setToken(token);
      setSigned(true);
      setPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  function handleLogout() {
    setEmail("");
    setPassword("");
    setToken("");
    setSigned(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Vault — Minimal & Private
          </h1>
          <div className="flex items-center gap-3">
            {/* 🌞 / 🌙 Toggle button
            <button
              onClick={toggleDark}
              className="p-2 rounded bg-white/70 dark:bg-gray-700 hover:scale-105 transition-transform"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button> */}
            {signed && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Signed in: {email}
              </div>
            )}
          </div>
        </div>

        {/* Auth or Vault */}
        {!signed ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow">
              <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
                Sign up / Sign in
              </h2>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded mb-3 bg-white/60 dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded mb-4 bg-white/60 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  disabled={!email || !password}
                  className="flex-1 bg-indigo-600 text-white rounded p-3 hover:bg-indigo-700"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  disabled={!email || !password}
                  className="flex-1 bg-green-600 text-white rounded p-3 hover:bg-green-700"
                >
                  Sign up
                </button>
              </div>
            </div>

            <PasswordGenerator onGenerated={setGenerated} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, <span className="font-medium">{email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <PasswordGenerator onGenerated={setGenerated} />
              <Vault quickAddPassword={generated} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
