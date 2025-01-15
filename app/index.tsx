import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Todo from '../screens/Todo';

const Stack = createNativeStackNavigator();

export default function Index() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='Home' component={Home} />
			<Stack.Screen name='Todo' component={Todo} />
		</Stack.Navigator>
	);
}
