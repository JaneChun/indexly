import { useTheme } from '@/store/ThemeContext';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ColorGroup from './ColorGroup';
import CustomModal from './CustomModal';

const SettingModal = ({ isVisible, onBackdropPress }) => {
	const { currentTheme, changeTheme, availableThemes, colors: Colors } = useTheme();

	return (
		<CustomModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<View style={styles.wrapper}>
				<View style={styles.container}>
					<ScrollView
						contentContainerStyle={styles.scrollViewContent}
						showsVerticalScrollIndicator={false}
					>
						{availableThemes.map((theme) => (
							<TouchableOpacity
								key={theme}
								style={styles.themeOption}
								onPress={() => changeTheme(theme)}
							>
								<ColorGroup theme={theme} isSelected={currentTheme === theme} />
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			</View>
		</CustomModal>
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
		height: 60,
	},
});

export default SettingModal;
