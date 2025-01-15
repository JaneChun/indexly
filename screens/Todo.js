import { View, Text, StyleSheet } from 'react-native';
import CollapsibleView from '../components/Todo/CollapsibleView';
import { useState } from 'react';

const Todo = () => {
	const [contentHeight, setContentHeight] = useState(0);

	return (
		<View
			style={styles.container}
			onLayout={(event) => {
				const { height } = event.nativeEvent.layout;
				setContentHeight(height);
			}}
		>
			<CollapsibleView
				title='Monthly'
				width='100%'
				contentHeight={contentHeight}
				offsetX={-180}
				offsetY={0}
			>
				<Text>Monthly Todos</Text>
			</CollapsibleView>

			<CollapsibleView
				title='Weekly'
				width='95%'
				contentHeight={contentHeight}
				offsetX={-90}
				offsetY={100}
			>
				<Text>Weekly Todos</Text>
			</CollapsibleView>

			<CollapsibleView
				title='Daily'
				width='90%'
				contentHeight={contentHeight}
				offsetX={0}
				offsetY={200}
			>
				<Text>Daily Todos</Text>
				<Text>Daily Todos</Text>
				<Text>Daily Todos</Text>
			</CollapsibleView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
});

export default Todo;
