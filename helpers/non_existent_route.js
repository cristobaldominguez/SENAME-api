import AccessError from "../errors/access_error.js"

const nonExistentRoute = (req, res) => {
  const { originalUrl: url, method } = req
  console.error({ error: { method, url } })

  throw new AccessError({ message: "Ruta no existente.", status: 404 })
}

export {
  nonExistentRoute
}
