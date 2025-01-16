import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import Home from '../screens/Home';
import Todo from '../screens/Todo';
import Loading from '../screens/Loading';

import { TodoContextProvider } from '../store/TodoContext';
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
		<TodoContextProvider>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name='Home' component={Home} />
				<Stack.Screen name='Todo' component={Todo} />
			</Stack.Navigator>
		</TodoContextProvider>
	);
}
