import {
	FontAwesome,
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

const IconButton = ({ type, icon, size, color, onPress, style }) => {
	return (
		<Pressable
			style={({ pressed }) => [
				style,
				styles.container,
				pressed && styles.pressed,
			]}
			onPress={onPress}
		>
			{type === 'FontAwesome' && (
				<FontAwesome
					styles={styles.button}
					name={icon}
					size={size}
					color={color}
				/>
			)}
			{type === 'MaterialIcons' && (
				<MaterialIcons
					styles={styles.button}
					name={icon}
					size={size}
					color={color}
				/>
			)}
			{type === 'MaterialCommunityIcons' && (
				<MaterialCommunityIcons
					styles={styles.button}
					name={icon}
					size={size}
					color={color}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	pressed: {
		opacity: 0.7,
	},
});

export default IconButton;
