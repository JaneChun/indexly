import { ColorThemes } from '@/constants/color';
import { useTheme } from '@/store/ThemeContext';
import { Octicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomModal from './CustomModal';

const SettingModal = ({ isVisible, onBackdropPress }) => {
	const { currentTheme, changeTheme, availableThemes, colors: Colors } = useTheme();

	return (
		<CustomModal
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
			contentContainerStyle={styles.contentContainerStyle}
		>
			<View style={styles.wrapper}>
				<View style={styles.container}>
					<ScrollView contentContainerStyle={styles.themeGrid} showsVerticalScrollIndicator={false}>
						{availableThemes.map((theme) => (
							<TouchableOpacity
								key={theme}
								style={[styles.themeOption]}
								onPress={() => changeTheme(theme)}
							>
								<View
									style={[
										styles.colorCircle,
										{
											backgroundColor: ColorThemes[theme].daily,
										},
									]}
								>
									{currentTheme === theme && <Octicons name='check' color='#fff' size={24} />}
								</View>
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
		width: '60%',
		aspectRatio: 1,
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
	},
	container: {
		flex: 1,
		padding: 24,
		borderRadius: 16,
		backgroundColor: '#fff',
	},
	contentContainerStyle: {
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		paddingTop: 60,
		paddingRight: 20,
	},
	themeGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	themeOption: {
		width: '25%',
		aspectRatio: 1,
		padding: 8,
	},
	colorCircle: {
		flex: 1,
		borderRadius: '50%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default SettingModal;
