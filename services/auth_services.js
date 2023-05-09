import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Import Queries
import { create_user, get_user_by } from '../db/queries/users.js'

// ErrorHandling
import AuthError from '../errors/auth_error.js'
import CustomError from '../errors/custom_error.js'

// Import Config
import { email_regex, expirationToken } from '../config.js'

// Helpers
import tokenIsExpirated from '../helpers/token_is_expirated.js'

// DotEnv
const accessTokenSecret = process.env.SECRET_KEY
if (!accessTokenSecret) console.error('Error: No SECRET_KEY inside .env file')

// POST /auth/signup
async function post_signup(req) {
  if (!req.body.email) throw new ValidationError({ message: "Debes llenar el campo email.", field: 'fields.email' })
  if (!req.body.password) throw new ValidationError({ message: "Debes llenar el campo password.", field: 'fields.password' })
  if (!req.body.password_confirm) throw new ValidationError({ message: "Debes llenar el campo password_confirm.", field: 'fields.password_confirm' })

  const email = req.sanitize(req.body.email).toLowerCase()
  const { password, password_confirm } = req.body

  if (!email.match(email_regex)) { throw new AuthError({ message: "Email no es válido." }) }

  if (!(email && password)) return new AuthError({ message: "Información no formateada correctamente." })
  if (password !== password_confirm) return new AuthError({ message: "Los campos password y password_confirm deben tener el mismo contenido." })

  // creating a new user
  const user = { email, password }

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10)

  // set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt)

  try {
    const saved_user = await create_user(user)
    return generate_token({ user: await saved_user })

  } catch (err) {
    console.error(err)
    if (err.is_an_error) {
      req.error = err
      return err
    }

    return new CustomError()
  }
}

// POST /auth/login
async function post_login(req) {
  if (!req.body.email) throw new ValidationError({ message: "Debes llenar el campo email." })
  if (!req.body.password) throw new ValidationError({ message: "Debes llenar el campo password." })

  const email = req.sanitize(req.body.email).toLowerCase()
  const { password } = req.body

  if (!email.match(email_regex)) { throw new AuthError({ message: "Email no es válido." }) }

  const user = await get_user_by({ email })
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (validPassword) {
      return generate_token({ user })

    } else {
      return new AuthError({ message: "Email o password inválido.", status: 400 })
    }

  } else {
    return new AuthError({ message: "Email o password inválido.", status: 401 })
  }
}

// Middlewares
function authenticate(req, res, next) {
  const jwt_auth = req.headers.authorization

  // Get token
  const token = jwt_auth ? get_token_from_jwt(jwt_auth) : null
  if (!token) throw new AuthError({ message: "Token no proporcionado" })

  // Verify token
  const decoded = jwt.decode(token)
  if (tokenIsExpirated(decoded)) throw new AuthError({ message: "Token caducado" })

  req.token = token
  next()
}

function set_user(req, _, next) {
  req.user = null
  if (!req.token) return 

  jwt.verify(req.token, accessTokenSecret, (err, user) => {
    if (err) return

    req.user = user
    next()
  })
}

function get_token_from_jwt(bearer) {
  return bearer.split(' ')[1]
}

function generate_token({ user }) {
  const token = jwt.sign(user, accessTokenSecret, { expiresIn: expirationToken })
  return {
    user: {
      id: user.id,
      email: user.email
    },
    accessToken: token
  }
}

export {
  set_user,
  authenticate,
  generate_token
}

export default { post_signup, post_login }
