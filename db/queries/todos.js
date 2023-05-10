import pool from "../pool.js"

/*
  C: Create (crear)
  R: Read (leer)
  U: Update (actualizar)
  D: Delete (borrar)
*/

/*
  Crear Todos
  Verbo: POST
  URL: /todos/
*/

async function create_todo({ content, done, user_id }) {
  const query = {
    text: 'INSERT INTO todos (content, done, user_id) VALUES ($1, $2, $3)',
    values: [content, done, user_id]
  }

  try {
    const result = await pool.query(query)
    console.log(result)
    return result.rows[0]

  } catch (error) {
    if (error.code === '22001') {
      throw new Error(error.message)
    }
  }
}

/*
  Leer Todos
  Verbo: GET
  URL: /todos/
*/
async function read_todos({ id }) {
  const query = {
    text: 'SELECT * FROM todos WHERE user_id = $1',
    values: [id]
  }

  try {
    const result = await pool.query(query)
    return result.rows

  } catch (error) {
    console.log(error)
  }
}

export {
  create_todo,
  read_todos
}
