# 🔐 Password Generator + Secure Vault (MVP)

> A **privacy-first web app** that lets users generate strong passwords and store them securely in an encrypted vault — built with **Next.js**, **Node.js**, and **MongoDB**.



---

## 🚀 Overview

This project is a **secure and minimal password manager** that allows you to:

- 🔑 **Generate** strong passwords instantly  
- 🧰 **Save** them into your personal encrypted vault  
- ✏️ **Edit / Delete** entries easily  
- 🧭 **Search / Filter** through your saved items  
- 🕵️ **Keep everything private** — encryption happens **client-side**  

---

## 🧠 Features

### 🧩 Core Features
- 🔒 **Client-Side Encryption:** Server never stores plaintext passwords  
- 📋 **Copy to Clipboard** with auto-clear after 10-20s  
- 🔎 **Search & Filter** vault items  
- 👤 **Email + Password Authentication** (JWT)  
- 🛠️ **Manage Vault Items:** title, username, password, URL, notes  

### 🌙 Optional / Nice-to-Have
- [x] **Dark / Light Mode Toggle**  
- [ ] Two-Factor Authentication (TOTP)  
- [ ] Tags / Folders for organization  
- [ ] Export / Import Encrypted Vault Data  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Backend** | Node.js / Express.js |
| **Database** | MongoDB |
| **Encryption** | AES (via `crypto-js`) |
| **Auth** | JWT (Email + Password) |

---

## 🔒 Security

- Vault items are **encrypted in the browser** using AES before sending to the backend  
- Server **never** has access to your plaintext data  
- Clipboard clears automatically after a few seconds  
- No secrets or sensitive data are logged  

> 🧠 **Crypto Note:**  
> Used `crypto-js` for AES encryption/decryption on the client for simplicity, reliability, and strong symmetric encryption suitable for an MVP.

---

## 💡 How It Works

1. 📨 **Sign Up / Log In** using email & password  
2. ⚙️ **Generate a Strong Password** (length slider + include/exclude options)  
3. 💾 **Save to Vault** with title, username, and notes  
4. 🧭 **Search / Edit / Delete** your entries  
5. 📋 **Copy Password** — automatically clears from clipboard  

---

## 🛠️ Setup & Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/password-vault.git
cd password-vault
