import { CUSTOM_COLORS_KEY, CustomColors, useTheme } from '@/store/ThemeContext';
import { useLocalization } from '@/store/LocalizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ColorPicker, { ColorFormatsObject, HueSlider, Panel1 } from 'reanimated-color-picker';

type Type = 'monthly' | 'weekly' | 'daily';

interface ColorPickerModalProps {
	customColors: CustomColors;
	setCustomColors: (customColors: CustomColors) => void;
	isVisible: boolean;
	onClose: () => void;
}

const ColorPickerModal = ({
	customColors,
	setCustomColors,
	isVisible,
	onClose,
}: ColorPickerModalProps) => {
	const { changeTheme } = useTheme();
	const { t } = useLocalization();
	const [tempColors, setTempColors] = useState<CustomColors>(customColors);
	const [selectedType, setSelectedType] = useState<Type>('monthly');

	useEffect(() => {
		if (isVisible) {
			setTempColors(customColors);
			setSelectedType('monthly');
		}
	}, [isVisible]);

	const tempColorEntries = useMemo(
		() => Object.entries(tempColors) as [Type, string][],
		[tempColors],
	);

	const handleSelectType = useCallback((type: Type) => {
		setSelectedType(type);
	}, []);

	const handleSelectColor = useCallback(
		({ hex }: ColorFormatsObject) => {
			setTempColors((prevColors) => ({
				...prevColors,
				[selectedType]: hex,
			}));
		},
		[selectedType],
	);

	// AsyncStorage 저장 & 상태 동기화 & 테마 적용
	const handleConfirm = useCallback(async () => {
		try {
			await AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(tempColors));
			setCustomColors(tempColors);
			await changeTheme('custom1'); // 커스텀 테마 즉시 적용
			onClose();
		} catch (e) {
			console.log('커스텀 색상 저장 실패', e);
		}
	}, [changeTheme, onClose, setCustomColors, tempColors]);

	const handleCancel = useCallback(() => {
		setTempColors(customColors); // 변경사항 되돌리기
		onClose();
	}, [customColors, onClose]);

	return (
		<Modal visible={isVisible} transparent={true} animationType='fade' onRequestClose={onClose}>
			<TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
				<View style={styles.container} onStartShouldSetResponder={() => true}>
					<Text style={styles.title}>{t('ui.colorPicker.title')}</Text>

					<View style={styles.previewContainer}>
						{tempColorEntries.map(([type, color], index) => (
							<TouchableOpacity key={type} onPress={() => handleSelectType(type)}>
								<View
									style={[
										styles.preview,
										{ backgroundColor: color, left: index * 40, zIndex: index },
										selectedType === type && { borderColor: '#333', borderWidth: 2 },
									]}
								/>
							</TouchableOpacity>
						))}
					</View>

					<View style={styles.pickerContainer}>
						<ColorPicker
							sliderThickness={20}
							style={{ width: '80%', gap: 16 }}
							value={tempColors[selectedType]}
							onCompleteJS={handleSelectColor}
						>
							<Panel1 />
							<HueSlider boundedThumb style={{ borderRadius: 25 }} />
						</ColorPicker>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
							<Text style={styles.cancelButtonText}>{t('ui.colorPicker.cancel')}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
							<Text style={styles.confirmButtonText}>{t('ui.colorPicker.confirm')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		width: '80%',
		maxWidth: 400,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 20,
		textAlign: 'center',
	},
	pickerContainer: {
		alignItems: 'center',
		marginBottom: 30,
	},
	colorPicker: {
		width: 250,
		height: 250,
	},
	previewContainer: {
		marginBottom: 24,
		position: 'relative',
		width: 132,
		height: 52,
		alignSelf: 'center',
	},
	preview: {
		width: 50,
		height: 50,
		borderRadius: '50%',
		position: 'absolute',
		top: 0,
		borderWidth: 1.5,
		borderColor: '#fff',
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	cancelButton: {
		flex: 1,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	cancelButtonText: {
		fontSize: 16,
		color: '#666',
	},
	confirmButton: {
		flex: 1,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		backgroundColor: '#333',
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
});

export default ColorPickerModal;
