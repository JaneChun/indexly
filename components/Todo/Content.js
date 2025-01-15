import { View, Text, StyleSheet, FlatList } from 'react-native';
import TodoItem from './TodoItem';

const Content = ({ isHidden, type }) => {
	const checkHandler = () => {
		// db
	};

	if (isHidden) {
		const previews = DUMMY_DATA.slice(0, 1);
		return (
			<>
				{previews.map((item) => (
					<TodoItem
						key={item.id}
						text={item.text}
						isCompleted={item.isCompleted}
					/>
				))}
				<Text style={styles.hiddenCount}>
					+ {DUMMY_DATA.length - 1}개의 할 일
				</Text>
			</>
		);
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={DUMMY_DATA}
				keyExtractor={({ id }) => id}
				renderItem={({ item }) => (
					<TodoItem
						text={item.text}
						isCompleted={item.isCompleted}
						onPress={checkHandler}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	hiddenCount: {
		fontSize: 12,
		marginLeft: 16,
		opacity: 0.5,
	},
});

export default Content;

const DUMMY_DATA = [
	{ id: 1, text: '보험 청구 서류 제출', isCompleted: false },
	{ id: 2, text: '젝시믹스 세일', isCompleted: true },
	{ id: 3, text: '운동', isCompleted: true },
	{ id: 4, text: '안티포그액 구매', isCompleted: true },
	{ id: 5, text: '지혜 집들이 선물 사기', isCompleted: false },
	{ id: 6, text: '원티드 다시보기', isCompleted: true },
	{ id: 7, text: '제주도 가는 표 사기', isCompleted: false },
	{ id: 8, text: '3 in 1 충전기 사기', isCompleted: false },
	{ id: 9, text: '...', isCompleted: false },
	{ id: 10, text: '...', isCompleted: false },
	{ id: 11, text: '...', isCompleted: false },
	{ id: 12, text: '...', isCompleted: false },
	{ id: 13, text: '...', isCompleted: false },
	{ id: 14, text: '...', isCompleted: false },
	{ id: 15, text: '...', isCompleted: false },
	{ id: 16, text: '...', isCompleted: false },
];
