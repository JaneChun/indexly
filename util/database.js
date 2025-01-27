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

	// meta 테이블 생성
	await db.execAsync(`CREATE TABLE IF NOT EXISTS meta (
		id INTEGER PRIMARY KEY NOT NULL,
		key TEXT NOT NULL,
		value TEXT NOT NULL
	)`);

	// todo 테이블 생성
	await db.execAsync(`CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY NOT NULL,
			type TEXT NOT NULL,
      text TEXT NOT NULL,
      isCompleted BOOLEAN NOT NULL,
			orderIndex INTEGER NOT NULL
    )`);

	// 초기화 여부 확인
	const isInitialized = await db.getFirstAsync(
		`SELECT value FROM meta WHERE key = ?`,
		['is_initialized'],
	);

	if (!isInitialized) {
		await db.execAsync(`
				INSERT INTO todo (type, text, isCompleted, orderIndex)
				VALUES
				('Daily', '두번 탭해서 수정하기', 1, 1),
				('Daily', '두번 탭해서 삭제하기', 0, 2),
				('Daily', '꾹 눌러서 드래그하기', 0, 3)
			`);

		await db.execAsync(
			`INSERT INTO meta (key, value) VALUES ('is_initialized', true)`,
		);
	}
};

export const insertTodo = async ({ type, text, orderIndex }) => {
	return await db.runAsync(
		'INSERT INTO todo (type, text, isCompleted, orderIndex) VALUES (?, ?, ?, ?)',
		type,
		text,
		false,
		orderIndex,
	);
};

export const updateTodo = async ({ id, text }) => {
	return await db.runAsync('UPDATE todo SET text = ? WHERE id = ?', [text, id]);
};

export const updateTypeTodo = async ({ id, type }) => {
	return await db.runAsync('UPDATE todo SET type = ? WHERE id = ?', [type, id]);
};

export const updateOrderIndexTodo = async ({ id, orderIndex }) => {
	return await db.runAsync('UPDATE todo SET orderIndex = ? WHERE id = ?', [
		orderIndex,
		id,
	]);
};

export const toggleTodoCompletion = async ({ id, isCompleted }) => {
	return await db.runAsync('UPDATE todo SET isCompleted = ? WHERE id = ?', [
		isCompleted,
		id,
	]);
};

export const deleteTodo = async ({ id }) => {
	return await db.runAsync('DELETE FROM todo WHERE id = ?', [id]);
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
