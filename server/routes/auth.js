const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../config/db')

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" })
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    )

    res.json({ message: "Signup successful" })

  } catch (err) {
    console.error("SIGNUP ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" })
    }

    const user = rows[0]

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Wrong password" })
    }

    req.session.userId = user.id

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })

  } catch (err) {
    console.error("LOGIN ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ message: "Logged out" })
})

// CHECK SESSION
router.get('/me', (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ loggedIn: false })

  res.json({ loggedIn: true, userId: req.session.userId })
})

module.exports = router