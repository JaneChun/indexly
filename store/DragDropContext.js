import { useState, useContext, createContext, useCallback } from 'react';

const DragDropContext = createContext();

export const DragDropContextProvider = ({ children }) => {
	const [draggingTodo, setDraggingTodo] = useState(null);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [dragStartPosition, setDragStartPosition] = useState(null);
	const [droppableZones, setDroppableZones] = useState({
		Monthly: { content: null, index: null },
		Weekly: { content: null, index: null },
		Daily: { content: null, index: null },
	});

	const memorizeDroppableZones = useCallback(({ type, content, index }) => {
		setDroppableZones((curDroppableZones) => {
			const currentZone = curDroppableZones[type] ?? {
				content: null,
				index: null,
			};
			const updatedZone = {
				content: content ?? currentZone.content,
				index: index ?? currentZone.index,
			};

			// 이전 상태와 동일하면 업데이트를 생략
			if (
				JSON.stringify(currentZone.content) ===
					JSON.stringify(updatedZone.content) &&
				JSON.stringify(currentZone.index) === JSON.stringify(updatedZone.index)
			) {
				return curDroppableZones;
			}

			return {
				...curDroppableZones,
				[type]: updatedZone,
			};
		});
	}, []);

	return (
		<DragDropContext.Provider
			value={{
				draggingTodo,
				setDraggingTodo,
				currentPosition,
				setCurrentPosition,
				dragStartPosition,
				setDragStartPosition,
				droppableZones,
				memorizeDroppableZones,
			}}
		>
			{children}
		</DragDropContext.Provider>
	);
};

export const useDragDropContext = () => useContext(DragDropContext);
