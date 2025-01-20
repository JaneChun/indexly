import { useDragDropContext } from '../store/DragDropContext';

export const useInsideZone = () => {
	const { currentPosition, droppableZones } = useDragDropContext();

	if (!currentPosition || !droppableZones) return null;

	const { x, y } = currentPosition;

	for (const [zoneName, { content, index }] of Object.entries(droppableZones)) {
		if (content) {
			const { startY, endY } = content;
			// 현재 위치가 드롭 영역 안에 있는지 확인
			if (y >= startY && y <= endY) {
				return zoneName;
			}
		}
		if (index) {
			const { startX, endX, startY, endY } = index;
			// 현재 위치가 드롭 영역 안에 있는지 확인
			if (x >= startX && x <= endX && y >= startY && y <= endY) {
				return zoneName;
			}
		}
	}

	return null;
};
