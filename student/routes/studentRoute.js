const express = require('express')
const router = express.Router()
const student = require('../middleware/student')

// Controllers
const { register, login, edit, remove, info, students, forgotPasswordRequest, forgotPassword, logout } = require('../controllers/student')

// Routes
router.post('/register', register)
router.post('/login', login)
router.patch('/edit', student, edit)
router.delete('/remove', student, remove)
router.get('/info', student, info)
router.get('/all', students)
router.post('/forgot-password/request/:usn', forgotPasswordRequest)
router.post('/forgot-password/:usn/:token', forgotPassword)
router.post('/logout', student, logout)

module.exports = router