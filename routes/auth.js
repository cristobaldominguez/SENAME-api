import express from 'express'

// Import Controllers
import auth_controller from '../controllers/auth_controller.js'

// Router Creation
const router = express.Router()

// Routes
// /auth/signup
router.post('/signup', auth_controller.post_signup)

// /auth/login
router.post('/login', auth_controller.post_login)

export default router
