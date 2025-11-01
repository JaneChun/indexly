import { CustomColors } from '@/store/ThemeContext';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const CIRCLE_SIZE = 30;
const GAP = 20;

type CustomColorGroupProps = {
	customColors: CustomColors;
	isSelected: boolean;
};

const CustomColorGroup = ({ customColors, isSelected }: CustomColorGroupProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.colorGroupWrapper}>
				<View
					style={[styles.colorCircle, styles.leftCircle, { backgroundColor: customColors.daily }]}
				/>
				<View
					style={[
						styles.colorCircle,
						styles.middleCircle,
						{ backgroundColor: customColors.weekly },
					]}
				/>
				<View
					style={[
						styles.colorCircle,
						styles.rightCircle,
						{ backgroundColor: customColors.monthly },
					]}
				/>
				{isSelected && (
					<View style={styles.iconWrapper}>
						<Octicons name='check' color='#fff' size={20} />
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorGroupWrapper: {
		width: 72,
		height: 32,
		position: 'relative',
	},
	colorCircle: {
		width: CIRCLE_SIZE,
		height: CIRCLE_SIZE,
		borderRadius: 25,
		borderWidth: 1.5,
		borderColor: '#fff',
	},
	leftCircle: {
		position: 'absolute',
		left: 0,
		zIndex: 1,
	},
	middleCircle: {
		position: 'absolute',
		left: GAP,
		zIndex: 2,
	},
	rightCircle: {
		position: 'absolute',
		left: GAP * 2,
		zIndex: 3,
	},
	iconWrapper: {
		position: 'absolute',
		left: GAP,
		zIndex: 4,
		width: CIRCLE_SIZE,
		height: CIRCLE_SIZE,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default CustomColorGroup;
