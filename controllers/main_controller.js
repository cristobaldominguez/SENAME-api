// Methods
// GET /
function get_home(_, res) {
  res.json({ message: 'Hello World' })
}

// GET /unauthorized
function get_unauthorized(_, res) {
  res.sendStatus(401)
}

// GET /404
function get_404(_, res) {
  res.sendStatus(404)
}

export default {
  get_home,
  get_404,
  get_unauthorized
}
