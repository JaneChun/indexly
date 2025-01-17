import { useState, useContext, createContext } from 'react';

const DragDropContext = createContext();

export const DragDropContextProvider = ({ children }) => {
	const [draggingTodoId, setDraggingTodoId] = useState(null);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [droppableZones, setDroppableZones] = useState({
		Monthly: null,
		Weekly: null,
		Daily: null,
	});

	const memorizeDroppableZones = ({ type, zone }) => {
		setDroppableZones((curDroppableZones) => {
			curDroppableZones[type] = zone;

			return curDroppableZones;
		});
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
