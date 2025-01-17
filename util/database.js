import * as SQLite from 'expo-sqlite';

let db;

const getDbInstance = async () => {
	if (!db) {
		db = await SQLite.openDatabaseAsync('places');
	}
	return db;
};

export const init = async () => {
	await getDbInstance();

	await db.execAsync(`CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY NOT NULL,
			type TEXT NOT NULL,
      text TEXT NOT NULL,
      isCompleted BOOLEAN NOT NULL
    )`);
};

export const insertTodo = async ({ type, text }) => {
	return await db.runAsync(
		'INSERT INTO todo (type, text, isCompleted) VALUES (?, ?, ?)',
		type,
		text,
		false,
	);
};

export const updateTodo = async ({ id, text }) => {
	return await db.runAsync('UPDATE todo SET text = ? WHERE id = ?', [text, id]);
};

export const updateTypeTodo = async ({ id, type }) => {
	return await db.runAsync('UPDATE todo SET type = ? WHERE id = ?', [type, id]);
};

export const deleteTodo = async ({ id }) => {
	return await db.runAsync('DELETE FROM todo WHERE id = ?', [id]);
};

export const toggleTodoCompletion = async ({ id, isCompleted }) => {
	return await db.runAsync('UPDATE todo SET isCompleted = ? WHERE id = ?', [
		isCompleted,
		id,
	]);
};

export const fetchAllTodos = async () => {
	return await db.getAllAsync('SELECT * FROM todo');
};

export const fetchTypedTodos = async ({ type }) => {
	return await db.getAllAsync('SELECT * FROM todo WHERE type = ?', [type]);
};

export const deleteAllCompletedTodos = async () => {
	return await db.runAsync('DELETE FROM todo WHERE isCompleted = ?', [true]);
};
