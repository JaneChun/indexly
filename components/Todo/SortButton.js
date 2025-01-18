import { useTodoContext } from '@/store/TodoContext';
import IconButton from './IconButton';

const SortButton = () => {
	const { sortTodos } = useTodoContext();

	const handleSortButtonPress = async () => {
		await sortTodos();
	};

	return (
		<IconButton
			type='MaterialCommunityIcons'
			icon='sort-bool-ascending-variant'
			size={24}
			color='gray'
			onPress={handleSortButtonPress}
		/>
	);
};

export default SortButton;
