const express = require('express')
const db = require('../config/db')

const router = express.Router()

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' })
  }
  next()
}

router.get('/all', requireLogin, async (req, res) => {
  try {
    console.log("fetching all users from db")

    const myId = req.session.userId

    const [rows] = await db.execute(`
      SELECT 
        u.id,
        u.username,
        u.avatar,
        CASE 
          WHEN f.id IS NOT NULL THEN 'friends'
          ELSE 'none'
        END AS relation
      FROM users u
      LEFT JOIN friendships f
        ON (
          (f.requester_id = ? AND f.receiver_id = u.id)
          OR
          (f.receiver_id = ? AND f.requester_id = u.id)
        )
      WHERE u.id != ?
    `, [myId, myId, myId])

    res.json(rows)

  } catch (err) {
    console.error("GET /all ERROR:", err)
    res.status(500).json({ error: 'Database error' })
  }
})


router.post('/:id', requireLogin, async (req, res) => {
  try {
    const myId = req.session.userId
    const otherId = req.params.id

    console.log("adding friendship")

    // prevent duplicate friendship
    const [existing] = await db.execute(`
      SELECT id FROM friendships
      WHERE (requester_id=? AND receiver_id=?)
         OR (requester_id=? AND receiver_id=?)
    `, [myId, otherId, otherId, myId])

    if (existing.length > 0) {
      return res.json({ message: 'Already friends' })
    }

    await db.execute(`
      INSERT INTO friendships (requester_id, receiver_id)
      VALUES (?, ?)
    `, [myId, otherId])

    res.json({ message: 'Friend added' })

  } catch (err) {
    console.error("ADD FRIEND ERROR:", err)
    res.status(500).json({ error: 'Database error' })
  }
})

router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const myId = req.session.userId
    const otherId = req.params.id

    await db.execute(`
      DELETE FROM friendships
      WHERE (requester_id=? AND receiver_id=?)
         OR (requester_id=? AND receiver_id=?)
    `, [myId, otherId, otherId, myId])

    res.json({ message: 'Friend removed' })

  } catch (err) {
    console.error("DELETE FRIEND ERROR:", err)
    res.status(500).json({ error: 'Database error' })
  }
})

module.exports = router