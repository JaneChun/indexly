import { createContext, useContext, useEffect, useState } from 'react';
import {
	fetchTypedTodos,
	insertTodo,
	updateTodo,
	deleteTodo,
	toggleTodoCompletion,
} from '../util/database';

const TodoContext = createContext();

export const TodoContextProvider = ({ children }) => {
	const [todos, setTodos] = useState({ Monthly: [], Weekly: [], Daily: [] });

	useEffect(() => {
		(async () => {
			await loadTodos();
		})();
	}, []);

	const loadTodos = async () => {
		try {
			const monthlyTodos = await fetchTypedTodos({ type: 'Monthly' });
			const weeklyTodos = await fetchTypedTodos({ type: 'Weekly' });
			const dailyTodos = await fetchTypedTodos({ type: 'Daily' });
			setTodos({
				Monthly: monthlyTodos,
				Weekly: weeklyTodos,
				Daily: dailyTodos,
			});
		} catch (err) {
			console.log('Failed to load todos:', err);
		}
	};

	const addTodo = async ({ type, text }) => {
		try {
			await insertTodo({ type, text });
			await loadTodos();
		} catch (err) {
			console.log('Failed to add todo:', err);
		}
	};

	const editTodo = async ({ id, text }) => {
		try {
			await updateTodo({ id, text });
			await loadTodos();
		} catch (err) {
			console.log('Failed to edit todo:', err);
		}
	};

	const removeTodo = async ({ id }) => {
		console.log('delete', id);
		try {
			await deleteTodo({ id });
			await loadTodos();
		} catch (err) {
			console.log('Failed to delete todo:', err);
		}
	};

	const toggleTodo = async ({ id, isCompleted }) => {
		try {
			await toggleTodoCompletion({ id, isCompleted: !isCompleted });
			await loadTodos();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<TodoContext.Provider
			value={{
				todos,
				loadTodos,
				addTodo,
				editTodo,
				removeTodo,
				toggleTodo,
			}}
		>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodoContext = () => useContext(TodoContext);

export const useTypedTodos = (type) => {
	const { todos } = useTodoContext();
	return todos[type] || [];
};
