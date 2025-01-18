import { StyleSheet, Pressable } from 'react-native';
import {
	FontAwesome,
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons';

const IconButton = ({ type, icon, size, color, onPress }) => {
	return (
		<Pressable
			style={({ pressed }) => [styles.container, pressed && styles.pressed]}
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
