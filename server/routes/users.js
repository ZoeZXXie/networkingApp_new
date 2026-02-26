const express = require('express')
const db = require('../config/db')

const router = express.Router()

const multer = require('multer')

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

// Get current logged-in user profile
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const [rows] = await db.execute(
      "SELECT id, username, email, bio, avatar FROM users WHERE id = ?",
      [req.session.userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(rows[0])

  } catch (err) {
    console.error("ME ERROR:", err)
    res.status(500).json({ message: "Database error" })
  }
})

router.put('/update', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = req.session.userId

    console.log(req.body)

    const { username, bio } = req.body

    let avatarPath = null

    if (req.file) {
      avatarPath = `/uploads/${req.file.filename}`
    }

    const sql = avatarPath
      ? 'UPDATE users SET username=?, bio=?, avatar=? WHERE id=?'
      : 'UPDATE users SET username=?, bio=? WHERE id=?'

    const params = avatarPath
      ? [username, bio, avatarPath, userId]
      : [username, bio, userId]

    await db.query(sql, params)

    const [updatedUser] = await db.query(
      'SELECT id, username, bio, avatar FROM users WHERE id=?',
      [userId]
    )

    res.json(updatedUser[0])

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Update failed' })
  }
})

module.exports = router