require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const friendRoutes = require('./routes/friends')
const messgaeRoutes = require('./routes/messages')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use(session({
  name: 'sid',
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // true if HTTPS
    maxAge: 1000 * 60 * 60 * 24  // 1 day
  }
}))

app.use('/uploads', express.static('uploads'))

// Routes
app.use('/', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/messages', messgaeRoutes)


app.listen(3000, () => {
  console.log('Server running on port 3000')
})