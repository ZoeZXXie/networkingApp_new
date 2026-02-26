const express = require('express')
const db = require('../config/db')

const router = express.Router()

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' })
  }
  next()
}

router.post('/send/:id', requireLogin, async (req, res) => {
  try {
    const senderId = req.session.userId
    const receiverId = req.params.id
    const { content } = req.body

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Empty message' })
    }

    await db.execute(`
      INSERT INTO messages (sender_id, receiver_id, content, is_public, created_at)
      VALUES (?, ?, ?, 0, NOW())
    `, [senderId, receiverId, content])

    res.json({ message: 'Message sent' })

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err)
    res.status(500).json({ error: 'Database error' })
  }
})

router.get('/chat/:id', requireLogin, async (req, res) => {
  try {
    const myId = req.session.userId
    const otherId = req.params.id

    const [rows] = await db.execute(`
      SELECT id, sender_id, receiver_id, content, created_at
      FROM messages
      WHERE (sender_id=? AND receiver_id=?)
         OR (sender_id=? AND receiver_id=?)
      ORDER BY created_at ASC
    `, [myId, otherId, otherId, myId])

    res.json(rows)

  } catch (err) {
    console.error("GET CHAT ERROR:", err)
    res.status(500).json({ error: 'Database error' })
  }
})

router.get('/list', requireLogin, async (req, res) => {
  const myId = req.session.userId

  const [rows] = await db.execute(`
    SELECT 
      u.id,
      u.username,
      u.avatar,
      m.content AS last_message,
      m.created_at
    FROM messages m
    JOIN users u
      ON (u.id = IF(m.sender_id = ?, m.receiver_id, m.sender_id))
    WHERE m.id IN (
      SELECT MAX(id)
      FROM messages
      WHERE sender_id=? OR receiver_id=?
      GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
    )
    ORDER BY m.created_at DESC
  `, [myId, myId, myId])

  res.json(rows)
})

module.exports = router