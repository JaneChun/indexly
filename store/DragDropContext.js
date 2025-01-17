import { useState, useContext, createContext } from 'react';

const DragDropContext = createContext();

export const DragDropContextProvider = ({ children }) => {
	const [draggingTodoId, setDraggingTodoId] = useState(null);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [droppableZones, setDroppableZones] = useState({
		Monthly: { content: null, index: null },
		Weekly: { content: null, index: null },
		Daily: { content: null, index: null },
	});

	const memorizeDroppableZones = ({ type, content, index }) => {
		setDroppableZones((curDroppableZones) => ({
			...curDroppableZones,
			[type]: {
				...curDroppableZones[type],
				content: content ? content : curDroppableZones[type]?.content,
				index: index ? index : curDroppableZones[type]?.index,
			},
		}));
	};

	return (
		<DragDropContext.Provider
			value={{
				draggingTodoId,
				setDraggingTodoId,
				currentPosition,
				setCurrentPosition,
				droppableZones,
				memorizeDroppableZones,
			}}
		>
			{children}
		</DragDropContext.Provider>
	);
};

export const useDragDropContext = () => useContext(DragDropContext);
