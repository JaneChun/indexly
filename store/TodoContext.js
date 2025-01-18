import { createContext, useContext, useEffect, useState } from 'react';
import {
	fetchTypedTodos,
	insertTodo,
	updateTodo,
	deleteTodo,
	toggleTodoCompletion,
	deleteAllCompletedTodos,
	updateTypeTodo,
	updateOrderIndexTodo,
} from '../util/database';

const TodoContext = createContext();

export const TodoContextProvider = ({ children }) => {
	const [todos, setTodos] = useState({ Monthly: [], Weekly: [], Daily: [] });

	useEffect(() => {
		(async () => {
			await loadTodos();
		})();
	}, []);

	const sortTodos = async () => {
		const { Monthly, Weekly, Daily } = todos;

		const sortedMonthly = await sortByIsCompleted(Monthly);
		const sortedWeekly = await sortByIsCompleted(Weekly);
		const sortedDaily = await sortByIsCompleted(Daily);

		setTodos({
			Monthly: sortedMonthly,
			Weekly: sortedWeekly,
			Daily: sortedDaily,
		});
	};

	const sortByIsCompleted = async (todos) => {
		try {
			// 정렬 로직
			const sortedTodos = todos.sort((a, b) => {
				if (a.isCompleted !== b.isCompleted) {
					return a.isCompleted - b.isCompleted;
				}
				return a.id - b.id;
			});

			// 정렬된 순서를 기반으로 데이터베이스 업데이트
			for (let i = 0; i < sortedTodos.length; i++) {
				await updateOrderIndexTodo(
					{ id: sortedTodos[i].id, orderIndex: i }, // 새로운 order 값 부여
				);
			}

			return sortedTodos; // 정렬된 데이터를 반환
		} catch (err) {
			console.log('Failed to update orderIndices:', err);
			return todos; // 에러 시 원래 데이터를 반환
		}
	};

	const sortByOrderIndex = (todos) => {
		return todos.sort((a, b) => a.orderIndex - b.orderIndex);
	};

	const loadTodos = async () => {
		try {
			const monthlyTodos = await fetchTypedTodos({ type: 'Monthly' });
			const weeklyTodos = await fetchTypedTodos({ type: 'Weekly' });
			const dailyTodos = await fetchTypedTodos({ type: 'Daily' });

			setTodos({
				Monthly: sortByOrderIndex(monthlyTodos),
				Weekly: sortByOrderIndex(weeklyTodos),
				Daily: sortByOrderIndex(dailyTodos),
			});
		} catch (err) {
			console.log('Failed to load todos:', err);
		}
	};

	const addTodo = async ({ type, text }) => {
		try {
			const typedTodos = todos[type];
			const maxOrder = typedTodos.length
				? Math.max(...typedTodos.map((todo) => todo.orderIndex))
				: 0;

			await insertTodo({ type, text, orderIndex: maxOrder + 1 });
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

	const moveTodo = async ({ id, destination }) => {
		try {
			await updateTypeTodo({ id, type: destination });
			await loadTodos();
		} catch (err) {
			console.log('Failed to move todo:', err);
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
			console.log(err);
		}
	};

	const removeCompletedTodo = async () => {
		try {
			await deleteAllCompletedTodos();
			await loadTodos();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<TodoContext.Provider
			value={{
				todos,
				sortTodos,
				loadTodos,
				addTodo,
				editTodo,
				moveTodo,
				removeTodo,
				toggleTodo,
				removeCompletedTodo,
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
