import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Colors } from '../../constants/color';

const CollapsibleView = ({
	title,
	width,
	offsetX,
	offsetY,
	contentHeight,
	isCollapsed,
	onToggle,
	children,
}) => {
	const [animation] = useState(new Animated.Value(0));

	const primaryColor = Colors[`${title.toLowerCase()}`];
	const secondaryColor = Colors[`${title.toLowerCase()}_light`];

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
					style={[styles.index, { backgroundColor: primaryColor }]}
					onPress={onToggle}
				>
					<Text style={styles.indexText}>{title}</Text>
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
				<View style={[styles.content, {}]}>{children}</View>
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
		textAlign: 'center',
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
		paddingTop: 12,
		paddingLeft: 12,
	},
});

export default CollapsibleView;
