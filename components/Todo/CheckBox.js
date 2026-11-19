import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const SIZE = 16;
const RADIUS = 6;
const BORDER = 1.5;

// iOS의 borderStyle 'dashed'는 둥근 모서리에서 원처럼 그려지므로 점선은 SVG로 그린다.
// stroke는 선 중심 기준이라 테두리 바깥선이 View 박스와 겹치도록 선 두께의 절반만큼 안쪽에 그린다.
const INSET = BORDER / 2;
const INNER = SIZE - BORDER;
const INNER_RADIUS = RADIUS - INSET;
const PERIMETER = 4 * (INNER - 2 * INNER_RADIUS) + 2 * Math.PI * INNER_RADIUS;
const DASH_COUNT = 8;
const DASH = (PERIMETER / DASH_COUNT) * 0.6; // 한 칸의 60%는 선, 40%는 간격
const GAP = PERIMETER / DASH_COUNT - DASH;

const CheckBox = ({ isCompleted, color, onPress, dashed }) => {
	return (
		<Pressable style={({ pressed }) => pressed && styles.pressed} onPress={onPress}>
			{dashed ? (
				<Svg width={SIZE} height={SIZE}>
					<Rect
						x={INSET}
						y={INSET}
						width={INNER}
						height={INNER}
						rx={INNER_RADIUS}
						stroke={color}
						strokeWidth={BORDER}
						strokeDasharray={[DASH, GAP]}
						fill='none'
					/>
				</Svg>
			) : (
				<View
					style={[styles.box, { borderColor: color }, isCompleted && { backgroundColor: color }]}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	box: {
		width: SIZE,
		height: SIZE,
		borderRadius: RADIUS,
		borderWidth: BORDER,
	},
	pressed: {
		opacity: 0.7,
	},
});

export default CheckBox;
