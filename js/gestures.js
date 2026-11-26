export const GESTURE_THRESHOLDS = Object.freeze({
  pinchEnter: 0.05,
  pinchExit: 0.08,
  fist: 0.25,
  palm: 0.4,
});

export function resolveGesture({ pinchDist, avgDist, mode }) {
  if (mode === 'FOCUS') {
    return pinchDist > GESTURE_THRESHOLDS.pinchExit ? 'exit-focus' : null;
  }
  if (avgDist < GESTURE_THRESHOLDS.fist) return 'lantern';
  if (pinchDist < GESTURE_THRESHOLDS.pinchEnter) return 'focus';
  if (avgDist > GESTURE_THRESHOLDS.palm) return 'scatter';
  return null;
}

export function nextFocusIndex(current, count) {
  if (!Number.isInteger(count) || count <= 0) return -1;
  return (current + 1) % count;
}
