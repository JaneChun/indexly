import { Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

import TodoItem from './TodoItem';
import { useTodoContext } from '../../store/TodoContext';

const Content = ({
	type,
	isEllipsed,
	currentSection,
	onPressBackground,
	onEditButtonPress,
}) => {
	const [todos, setTodos] = useState([]);
	const [selectedTodoId, setSelectedTodoId] = useState(null);
	const { todos: allTodos } = useTodoContext();

	useEffect(() => {
		setTodos(allTodos[type]);
	});

	useEffect(() => {
		setSelectedTodoId(null);
	}, [currentSection]);

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
						isReadOnly={true}
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
						onLongPress={handleTodoLongPress}
						onEditButtonPress={onEditButtonPress}
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
