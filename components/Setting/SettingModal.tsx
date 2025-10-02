import { ThemeName, useTheme } from '@/store/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ColorGroup from './ColorGroup';
import ColorPickerModal from './ColorPickerModal';
import CustomColorGroup from './CustomColorGroup';
import CustomModal from './CustomModal';

export const CUSTOM_COLORS_KEY = 'customColors';

const DEFAULT_CUSTOM_COLORS: CustomColors = {
	monthly: '#e0e0e0',
	weekly: '#e0e0e0',
	daily: '#e0e0e0',
};

export type CustomColors = {
	monthly: string;
	weekly: string;
	daily: string;
};

type SettingModalProps = {
	isVisible: boolean;
	onBackdropPress: () => void;
};

const SettingModal = ({ isVisible, onBackdropPress }: SettingModalProps) => {
	const { currentTheme, changeTheme, themeNames, colors: Colors } = useTheme();
	const [colorPickerVisible, setColorPickerVisible] = useState(false);
	const [customColors, setCustomColors] = useState<CustomColors>(DEFAULT_CUSTOM_COLORS);

	useEffect(() => {
		if (isVisible) {
			loadCustomColors();
		}
	}, [isVisible]);

	const loadCustomColors = async () => {
		try {
			const storedColors = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);
			if (storedColors) {
				const colors = JSON.parse(storedColors);
				setCustomColors(colors);
			}
		} catch (e) {
			console.log('커스텀 색상 불러오기 실패', e);
		}
	};

	const handleThemeChange = useCallback(
		(theme: string) => {
			changeTheme(theme as ThemeName);
		},
		[changeTheme],
	);

	const handleCustomColorsChange = useCallback((customColors: CustomColors) => {
		setCustomColors(customColors);
	}, []);

	return (
		<>
			<CustomModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
				<View style={styles.wrapper}>
					<View style={styles.container}>
						<ScrollView
							contentContainerStyle={styles.scrollViewContent}
							showsVerticalScrollIndicator={false}
						>
							{themeNames.map((theme) => (
								<TouchableOpacity
									key={theme}
									style={styles.themeOption}
									onPress={() => handleThemeChange(theme)}
								>
									<ColorGroup theme={theme} isSelected={currentTheme === theme} />
								</TouchableOpacity>
							))}

							<View style={styles.divider} />

							<TouchableOpacity
								style={styles.themeOption}
								onPress={() => setColorPickerVisible(true)}
							>
								<CustomColorGroup customColors={customColors} isSelected={false} />
							</TouchableOpacity>
						</ScrollView>
					</View>
				</View>
			</CustomModal>

			<ColorPickerModal
				isVisible={colorPickerVisible}
				onClose={() => setColorPickerVisible(false)}
				customColors={customColors}
				setCustomColors={handleCustomColorsChange}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: '32%',
		height: '80%',
		alignSelf: 'flex-end',
		marginRight: 16,
		marginTop: -16,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 24,
		borderRadius: 16,
		backgroundColor: '#fff',
	},
	scrollViewContent: {
		gap: 12,
	},
	themeOption: {
		flex: 1,
		marginVertical: 8,
	},
	divider: {
		height: 1,
		backgroundColor: '#E0E0E0',
		marginVertical: 4,
	},
});

export default SettingModal;
