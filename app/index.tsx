import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PortalProvider } from '@gorhom/portal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Loading from '../screens/Loading';
import Todo from '../screens/Todo';

import { DragDropContextProvider } from '@/store/DragDropContext';
import { LocalizationProvider } from '../store/LocalizationContext';
import { TodoContextProvider } from '../store/TodoContext';
import { ThemeProvider } from '../store/ThemeContext';
import { init } from '../util/database';

const Stack = createNativeStackNavigator();

export default function Index() {
	const [isDbInitialized, setIsDbInitialized] = useState(false);

	useEffect(() => {
		const initDatabase = async () => {
			try {
				await init();
				console.log('Database initialized successfully.');
				setIsDbInitialized(true);
			} catch (err) {
				console.log(err);
			}
		};

		initDatabase();
	}, []);

	if (!isDbInitialized) {
		return <Loading />;
	}

	return (
		<>
			<StatusBar backgroundColor='#ffffff' hidden={true} />
			<PortalProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<ThemeProvider>
						<LocalizationProvider>
							<ActionSheetProvider>
								<DragDropContextProvider>
									<TodoContextProvider>
										<Stack.Navigator
											screenOptions={{
												headerShown: false,
												contentStyle: { backgroundColor: '#ffffff' },
											}}
										>
											{/* <Stack.Screen name='Home' component={Home} /> */}
											<Stack.Screen name='Todo' component={Todo} />
										</Stack.Navigator>
									</TodoContextProvider>
								</DragDropContextProvider>
							</ActionSheetProvider>
						</LocalizationProvider>
					</ThemeProvider>
				</GestureHandlerRootView>
			</PortalProvider>
		</>
	);
}
