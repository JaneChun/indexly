import { useDragDropContext } from '../store/DragDropContext';

export const useInsideZone = () => {
	const { currentPosition, droppableZones } = useDragDropContext();

	if (!currentPosition || !droppableZones) return null;

	const { x, y } = currentPosition;

	const zones = Object.entries(droppableZones);

	// 인덱스(탭) 영역을 먼저 확인: 탭은 뒤쪽 섹션의 콘텐츠 영역과 높이가 겹칠 수 있음
	for (const [zoneName, { index }] of zones) {
		if (index) {
			const { startX, endX, startY, endY } = index;
			if (x >= startX && x <= endX && y >= startY && y <= endY) {
				return zoneName;
			}
		}
	}

	for (const [zoneName, { content }] of zones) {
		if (content) {
			const { startY, endY } = content;
			// 현재 위치가 드롭 영역 안에 있는지 확인
			if (y >= startY && y <= endY) {
				return zoneName;
			}
		}
	}

	return null;
};
