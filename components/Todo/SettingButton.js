import IconButton from './IconButton';

const SettingButton = ({ style, onPress }) => {
	return (
		<IconButton
			style={style}
			type='MaterialIcons'
			icon='invert-colors'
			size={24}
			color='gray'
			onPress={onPress}
		/>
	);
};

export default SettingButton;
