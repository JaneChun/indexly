import { useDragDropContext } from '../store/DragDropContext';

export const useInsideZone = () => {
	const { currentPosition, droppableZones } = useDragDropContext();

	if (!currentPosition || !droppableZones) return null;

	const { x, y } = currentPosition;

	for (const [zoneName, zones] of Object.entries(droppableZones)) {
		for (const zone of Object.values(zones)) {
			if (zone) {
				const { startX, endX, startY, endY } = zone;
				// 현재 위치가 드롭 영역 안에 있는지 확인
				if (x >= startX && x <= endX && y >= startY && y <= endY) {
					return zoneName;
				}
			}
		}
	}

	return null;
};
