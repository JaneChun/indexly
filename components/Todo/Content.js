import { Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

import TodoItem from './TodoItem';
import { fetchTypedTodos } from '../../util/database';

const Content = ({
	type,
	isEllipsed,
	onPressBackground,
	onEditButtonPress,
	onDeleteButtonPress,
}) => {
	const [todos, setTodos] = useState([]);
	const [selectedTodoId, setSelectedTodoId] = useState(null);

	useEffect(() => {
		const loadTodo = async () => {
			try {
				const fetchedTodos = await fetchTypedTodos({ type });
				setTodos(fetchedTodos);
			} catch (err) {
				console.log(err);
			}
		};

		loadTodo();
	}, []);

	const handleCheckboxPress = () => {
		// console.log('Checkbox pressed for ID:', id);
	};

	const handleTodoLongPress = (id) => {
		setSelectedTodoId(id);
	};

	const handlePressBackground = () => {
		if (selectedTodoId) {
			setSelectedTodoId(null);
		} else {
			onPressBackground();
		}
	};

	if (isEllipsed) {
		const previews = todos.slice(0, 1);
		return (
			<>
				{previews.map((item) => (
					<TodoItem
						key={item.id}
						text={item.text}
						isCompleted={item.isCompleted}
					/>
				))}
				{todos.length > 1 && (
					<Text style={styles.hiddenCount}>+ {todos.length - 1}개의 할 일</Text>
				)}
			</>
		);
	}
	return (
		<Pressable onPress={handlePressBackground} style={styles.content}>
			<FlatList
				data={todos}
				keyExtractor={({ id }) => id}
				renderItem={({ item }) => (
					<TodoItem
						{...item}
						isButtonsVisible={selectedTodoId === item.id}
						onPress={handleCheckboxPress}
						onLongPress={handleTodoLongPress}
						onEditButtonPress={onEditButtonPress}
						onDeleteButtonPress={onDeleteButtonPress}
					/>
				)}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {},
	content: {
		flex: 1,
	},
	hiddenCount: {
		fontSize: 12,
		marginLeft: 16,
		opacity: 0.5,
	},
});

export default Content;
