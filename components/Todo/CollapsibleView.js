import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Colors } from '../../constants/color';

import Content from './Content';

const CollapsibleView = ({
	type,
	width,
	offsetX,
	offsetY,
	contentHeight,
	isCollapsed,
	onToggle,
	isEllipsed,
	onPressBackground,
	onLongPress,
}) => {
	const [animation] = useState(new Animated.Value(0));

	const primaryColor = Colors[`${type.toLowerCase()}`];
	const secondaryColor = Colors[`${type.toLowerCase()}_light`];

	const indexXTranslate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, offsetX],
	});

	const indexYTranslate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [offsetY, contentHeight - 95],
	});

	const heightInterpolate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [contentHeight - 89 - offsetY, 0],
	});

	const borderBottomRightRadiusInterpolate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [16, 3],
	});

	Animated.timing(animation, {
		toValue: isCollapsed ? 0 : 1,
		duration: 300,
		useNativeDriver: false,
	}).start();

	return (
		<View style={styles.container}>
			{/* 움직이는 인덱스 */}
			<Animated.View
				style={[
					styles.indexContainer,
					{
						transform: [
							{ translateX: indexXTranslate },
							{ translateY: indexYTranslate },
						],
					},
				]}
			>
				<Pressable
					style={({ pressed }) => [
						styles.index,
						{ backgroundColor: primaryColor },
						pressed && styles.pressed,
					]}
					onPress={onToggle}
				>
					<Text style={styles.indexText}>{type}</Text>
				</Pressable>
			</Animated.View>

			{/* 접었다 펴지는 콘텐츠 */}
			<Animated.View
				style={[
					styles.contentContainer,
					{
						borderColor: primaryColor,
						backgroundColor: secondaryColor,
						width: width,
						height: heightInterpolate,
						borderBottomRightRadius: borderBottomRightRadiusInterpolate,
					},
				]}
			>
				<View style={styles.content}>
					<Content
						isEllipsed={isEllipsed}
						type={type}
						onPressBackground={onPressBackground}
						onLongPress={onLongPress}
					/>
				</View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		backgroundColor: 'transparent',
	},
	indexContainer: {
		zIndex: 10,
		alignSelf: 'flex-end',
		backgroundColor: 'transparent',
	},
	index: {
		width: 120,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	indexText: {
		fontSize: 12,
		textAlign: 'center',
	},
	pressed: {
		opacity: 0.7,
	},
	contentContainer: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		alignSelf: 'flex-end',
		overflow: 'hidden',
		borderWidth: 3,
		borderRadius: 16,
		borderTopRightRadius: 0,
	},
	content: {
		width: '100%',
		height: '100%',
		padding: 24,
	},
});

export default CollapsibleView;
