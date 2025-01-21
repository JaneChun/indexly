import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import { MONTHLY, WEEKLY, DAILY } from '@/constants/type';

const screenWidth = Dimensions.get('window').width;

const Circle = ({ children, type, onPress }) => {
	const getCircleStyle = (type) => {
		const monthlySize = screenWidth * 0.5;
		const weeklySize = monthlySize * 0.65;
		const dailySize = weeklySize * 0.5;

		let size;
		let backgroundColor;

		switch (type) {
			case MONTHLY:
				size = monthlySize;
				backgroundColor = '#FFE2E2';
				break;
			case WEEKLY:
				size = weeklySize;
				backgroundColor = '#FFB9B9';
				break;
			case DAILY:
				size = dailySize;
				backgroundColor = '#FF8383';
				break;
			default:
				size = 0;
				backgroundColor = '#ffffff';
		}
		return {
			width: size,
			height: size,
			borderRadius: size / 2,
			backgroundColor,
		};
	};

	const pressHandler = () => {
		onPress({ type });
	};

	return (
		<>
			<Text style={styles.label}>{type}</Text>

			<Pressable
				style={({ pressed }) => [
					styles.circle,
					styles.monthly,
					getCircleStyle(type),
					pressed && styles.pressed,
				]}
				onPress={pressHandler}
			>
				{children}
			</Pressable>
		</>
	);
};

const styles = StyleSheet.create({
	circle: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	pressed: {
		opacity: 0.7,
	},
	label: {
		textAlign: 'center',
		fontSize: 16,
		// fontWeight: 'bold',
		marginBottom: '2%',
	},
});

export default Circle;
