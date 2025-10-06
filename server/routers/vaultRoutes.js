 

//  import express from "express";
// import User from "../models/User.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // GET vault
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("vault");
//     res.json({ vault: user.vault });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // SAVE vault
// router.put("/", authMiddleware, async (req, res) => {
//   try {
//     const { salt, blob } = req.body;
//     if (!salt || !blob)
//       return res.status(400).json({ message: "Invalid vault data" });

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { vault: { salt, blob, updatedAt: new Date() } },
//       { new: true }
//     ).select("vault");

//     res.json({ vault: user.vault });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE vault
// router.delete("/", authMiddleware, async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, { vault: null });
//     res.json({ message: "Vault cleared" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📦 GET Vault
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("vault");
    res.json({ vault: user?.vault || null });
  } catch (err) {
    console.error("Vault GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 💾 SAVE Vault
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { salt, blob } = req.body;
    if (!salt || !blob) return res.status(400).json({ message: "Invalid vault data" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { vault: { salt, blob, updatedAt: new Date() } },
      { new: true }
    ).select("vault");

    res.json({ vault: updatedUser.vault });
  } catch (err) {
    console.error("Vault SAVE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑️ DELETE Vault
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { vault: null });
    res.json({ message: "Vault cleared" });
  } catch (err) {
    console.error("Vault DELETE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
