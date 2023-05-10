import express from 'express'
import expressSanitizer from 'express-sanitizer'

// Configuraciones
import dotenv from 'dotenv'
import { port } from './config.js'

// Manejo de Errores
import 'express-async-errors'

// Rutas
import mainRoutes from './routes/main.js'
import authRoutes from './routes/auth.js'
import todosRoutes from './routes/todos.js'

// Middlewares
import errorMiddleware from './middlewares/error_middleware.js'
import checkValidJSON from './middlewares/check_valid_JSON_middleware.js'

// Ayudas
import { nonExistentRoute } from './helpers/non_existent_route.js'

// Configuración de dotEnv
dotenv.config()

// Creación del Server
const app = express()

// body-parser -> From Express 4.16+
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Revisa que el JSON sea válido
app.use(checkValidJSON)

// express-sanitizer middleware
app.use(expressSanitizer())

// Rutas de la Aplicación
app.use(mainRoutes)
app.use('/auth', authRoutes)
app.use('/todos', todosRoutes)

// Redirección 404 cuando no se encuentra el recurso
app.get('*', nonExistentRoute)

// Retorno de errores a usuarios
app.use(errorMiddleware)

// Correr el Servidor
app.listen(port, _ => console.log(`Server Running at: http://localhost:${port}/`))
