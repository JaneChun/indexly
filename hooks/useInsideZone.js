import { useDragDropContext } from '../store/DragDropContext';

export const useInsideZone = () => {
	const { currentPosition, droppableZones } = useDragDropContext();

	if (!currentPosition || !droppableZones) return null;

	const { x, y } = currentPosition;

	for (const [zoneName, zoneBounds] of Object.entries(droppableZones)) {
		if (zoneBounds) {
			const { startX, startY, endX, endY } = zoneBounds;
			if (x >= startX && x <= endX && y >= startY && y <= endY) {
				return zoneName;
			}
		}
	}

	return null;
};
