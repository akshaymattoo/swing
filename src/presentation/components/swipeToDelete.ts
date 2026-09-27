export function clampSwipePosition(position: number, actionWidth: number) {
  return Math.max(-actionWidth, Math.min(0, position));
}

export function swipeDeleteTarget(position: number, velocityX: number, actionWidth: number) {
  const openThreshold = actionWidth * 0.35;
  return position <= -openThreshold || velocityX < -0.35 ? -actionWidth : 0;
}
