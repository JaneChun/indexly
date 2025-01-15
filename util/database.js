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

export const fetchAllTodos = async () => {
	return await db.getAllAsync('SELECT * FROM todo');
};

export const fetchTypedTodos = async ({ type }) => {
	return await db.getAllAsync('SELECT * FROM todo WHERE type = ?', [type]);
};
