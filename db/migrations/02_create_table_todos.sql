-- psql -d proyecto_todo_db -a -f db/migrations/02_create_table_todos.sql

DROP TABLE IF EXISTS todos;
CREATE TABLE todos(
  id SERIAL,

  done BOOLEAN DEFAULT FALSE,
  content VARCHAR(250) NOT NULL,
  user_id INTEGER,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
