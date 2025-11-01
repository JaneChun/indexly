import { ColorThemes } from '@/constants/color';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface ColorGroupProps {
	theme: keyof typeof ColorThemes;
	isSelected: boolean;
}

const CIRCLE_SIZE = 30;
const GAP = 20;

const ColorGroup = ({ theme, isSelected }: ColorGroupProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.colorGroupWrapper}>
				<View
					style={[
						styles.colorCircle,
						styles.leftCircle,
						{
							backgroundColor: ColorThemes[theme].daily,
						},
					]}
				/>
				<View
					style={[
						styles.colorCircle,
						styles.middleCircle,
						{
							backgroundColor: ColorThemes[theme].weekly,
						},
					]}
				/>
				<View
					style={[
						styles.colorCircle,
						styles.rightCircle,
						{
							backgroundColor: ColorThemes[theme].monthly,
						},
					]}
				/>
				{isSelected && (
					<View style={styles.checkIconWrapper}>
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
	checkIconWrapper: {
		position: 'absolute',
		left: GAP,
		zIndex: 4,
		width: CIRCLE_SIZE,
		height: CIRCLE_SIZE,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ColorGroup;
