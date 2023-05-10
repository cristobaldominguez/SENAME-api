import express from 'express'

// Import Controllers
import { authenticate, set_user } from '../services/auth_services.js'

// Import Querys
import { create_todo, read_todos } from '../db/queries/todos.js'

// Router Creation
const router = express.Router()

// Routes
// POST /todos/
router.post( '/', authenticate, set_user, async (req,res) => {
  const user_id = req.user.id
  const { done, content } = req.body

  const todo = await create_todo({ done, content, user_id })

  res.status(200).json(todo)
})

// GET /todos/
router.get('/', authenticate, set_user, async (req,res) => {
  const { id } = req.user
  const todos = await read_todos({ id })

  res.status(200).json(todos)
})

export default router
