import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useKeyboardVisibility = () => {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [keyboardOffset, setKeyboardOffset] = useState(0);
	const keyboardHeight = useRef(new Animated.Value(0)).current;

	const insets = useSafeAreaInsets();

	const showEvent =
		Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
	const hideEvent =
		Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
			setKeyboardVisible(true);

			const offset = e.endCoordinates.height - (Platform.OS === 'ios' ? insets.bottom : 0); // 키보드 높이
			setKeyboardOffset(offset);

			Animated.timing(keyboardHeight, {
				toValue: offset,
				duration: 300,
				useNativeDriver: false,
			}).start();
		});
		const keyboardDidHideListener = Keyboard.addListener(hideEvent, (e) => {
			setKeyboardVisible(false);
			Animated.timing(keyboardHeight, {
				toValue: 0, // 키보드 높이
				duration: 300,
				useNativeDriver: false,
			}).start();
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return { isKeyboardVisible, keyboardHeight, keyboardOffset };
};
