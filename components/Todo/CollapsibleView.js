import { useEffect, useRef } from 'react';
import {
	Animated,
	InteractionManager,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Colors } from '../../constants/color';

import { useInsideZone } from '@/hooks/useInsideZone';
import { useDragDropContext } from '@/store/DragDropContext';
import Content from './Content';

const CollapsibleView = ({
	type,
	width,
	offsetX,
	height,
	isCollapsed,
	onToggle,
	isEllipsed,
	currentSection,
	onPressBackground,
	onEditButtonPress,
	editingId,
}) => {
	const { memorizeDroppableZones } = useDragDropContext();
	const animation = useRef(new Animated.Value(0)).current;
	const indexRef = useRef(null);
	const isInside = type === useInsideZone();

	const primaryColor = Colors[`${type.toLowerCase()}`];
	const secondaryColor = Colors[`${type.toLowerCase()}_light`];

	// 0: 펼침, 1: 접음
	const indexXTranslate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, offsetX],
	});

	const indexYTranslate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [height, 0],
	});

	const heightInterpolate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [height, 0],
	});

	const borderBottomRightRadiusInterpolate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [16, 3],
	});

	useEffect(() => {
		Animated.timing(animation, {
			toValue: isCollapsed ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start(() => {
			// 인덱스 영역의 위치와 크기를 저장
			InteractionManager.runAfterInteractions(() => {
				indexRef?.current?.measureInWindow((x, y, width, height) => {
					memorizeDroppableZones({
						type,
						index: {
							startX: x,
							startY: y,
							endX: x + width,
							endY: y + height,
						},
					});
				});
			});
		});
	}, [isCollapsed, memorizeDroppableZones, type]);

	return (
		<View style={styles.container}>
			{/* 움직이는 인덱스 */}
			<Animated.View
				ref={indexRef}
				style={[
					styles.indexContainer,
					{
						bottom: indexYTranslate,
						right: indexXTranslate,
					},
				]}
			>
				<Pressable
					style={({ pressed }) => [
						styles.index,
						{ backgroundColor: primaryColor },
						isInside && styles.pressed,
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
						width: width,
						height: heightInterpolate,
						borderColor: primaryColor,
						backgroundColor: secondaryColor,
						borderBottomRightRadius: borderBottomRightRadiusInterpolate,
					},
				]}
			>
				<View style={styles.content}>
					<Content
						type={type}
						isCollapsed={isCollapsed}
						isEllipsed={isEllipsed}
						currentSection={currentSection}
						onPressBackground={onPressBackground}
						onEditButtonPress={onEditButtonPress}
						editingId={editingId}
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
		position: 'absolute',
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
		fontSize: 14,
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
		borderWidth: 3,
		borderRadius: 16,
		borderTopRightRadius: 0,
	},
	content: {
		width: '100%',
		height: '100%',
		padding: 18,
	},
});

export default CollapsibleView;
