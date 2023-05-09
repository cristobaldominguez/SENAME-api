// Methods
// GET /examples/
function get_index(req, res) {
  res.json({ message: `Hello ${req.user.email}! You're authenticated successfully` })
}

export default {
  get_index
}
