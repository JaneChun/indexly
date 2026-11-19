import { useEffect, useRef } from 'react';
import { Animated, InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/store/ThemeContext';

import { TYPE_TRANSLATION_KEYS } from '@/constants/type';
import { useInsideZone } from '@/hooks/useInsideZone';
import { useDragDropContext } from '@/store/DragDropContext';
import { useLocalization } from '@/store/LocalizationContext';
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
	onAddPress,
	onEditButtonPress,
	editingId,
}) => {
	const { memorizeDroppableZones } = useDragDropContext();
	const { t } = useLocalization();
	const { colors: Colors } = useTheme();
	const animation = useRef(new Animated.Value(0)).current;
	const indexRef = useRef(null);
	const isInside = type === useInsideZone();

	const primaryColor = Colors[`${type.toLowerCase()}`];
	const surfaceColor = Colors[`${type.toLowerCase()}_surface`];

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
		outputRange: [18, 3],
	});

	const borderTopWidthInterpolate = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [3, 0],
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
						isInside && [styles.dropTarget, { borderColor: Colors.daily }],
						pressed && styles.pressed,
					]}
					onPress={onToggle}
				>
					<Text
						numberOfLines={1}
						ellipsizeMode='tail'
						style={[styles.indexText, { color: Colors.index_text }]}
					>
						{t(TYPE_TRANSLATION_KEYS[type])}
					</Text>
				</Pressable>
			</Animated.View>

			{/* 접었다 펴지는 콘텐츠 */}
			<Animated.View
				style={[
					styles.contentContainer,
					{
						width: width,
						height: heightInterpolate,
						borderTopColor: primaryColor,
						borderTopWidth: borderTopWidthInterpolate,
						backgroundColor: surfaceColor,
						shadowColor: Colors.shadow,
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
						onAddPress={onAddPress}
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
		borderTopLeftRadius: 14,
		borderTopRightRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},
	indexText: {
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 0.2,
		textAlign: 'center',
		verticalAlign: 'center',
	},
	pressed: {
		opacity: 0.7,
	},
	dropTarget: {
		borderWidth: 2,
		transform: [{ translateY: -3 }],
	},
	contentContainer: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		alignSelf: 'flex-end',
		borderRadius: 18,
		borderTopRightRadius: 0,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.12,
		shadowRadius: 10,
		elevation: 3,
	},
	content: {
		width: '100%',
		height: '100%',
		padding: 18,
	},
});

export default CollapsibleView;
