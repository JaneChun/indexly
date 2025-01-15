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

	return await db.execAsync(`CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      isCompleted BOOLEAN NOT NULL
    )`);
};

export const insertTodo = async ({ type, text }) => {
	return await db.runAsync(
		'INSERT INTO todo (type, text) VALUES (?, ?)',
		type,
		text,
	);
};
