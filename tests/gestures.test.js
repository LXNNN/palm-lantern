import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveGesture, nextFocusIndex, GESTURE_THRESHOLDS } from '../js/gestures.js';

test('pinch enters focus and releases above the exit threshold', () => {
  assert.equal(resolveGesture({ pinchDist: 0.04, avgDist: 0.5, mode: 'TREE' }), 'focus');
  assert.equal(resolveGesture({ pinchDist: 0.06, avgDist: 0.5, mode: 'FOCUS' }), null);
  assert.equal(resolveGesture({ pinchDist: 0.09, avgDist: 0.5, mode: 'FOCUS' }), 'exit-focus');
});

test('focus holds while pinch is held', () => {
  assert.equal(resolveGesture({ pinchDist: 0.04, avgDist: 0.1, mode: 'FOCUS' }), null);
  assert.equal(resolveGesture({ pinchDist: 0.06, avgDist: 0.3, mode: 'FOCUS' }), null);
});

test('fist wins over pinch; pinch focuses when not a fist', () => {
  assert.equal(resolveGesture({ pinchDist: 0.03, avgDist: 0.2, mode: 'SCATTER' }), 'lantern');
  assert.equal(resolveGesture({ pinchDist: 0.04, avgDist: 0.35, mode: 'TREE' }), 'focus');
});

test('fist gathers and palm scatters', () => {
  assert.equal(resolveGesture({ pinchDist: 0.2, avgDist: 0.2, mode: 'SCATTER' }), 'lantern');
  assert.equal(resolveGesture({ pinchDist: 0.2, avgDist: 0.5, mode: 'TREE' }), 'scatter');
  assert.equal(resolveGesture({ pinchDist: 0.2, avgDist: 0.3, mode: 'TREE' }), null);
});

test('thresholds are the original values', () => {
  assert.deepEqual(GESTURE_THRESHOLDS, { pinchEnter: 0.05, pinchExit: 0.08, fist: 0.25, palm: 0.4 });
});

test('focus cycles and wraps', () => {
  assert.equal(nextFocusIndex(-1, 4), 0);
  assert.equal(nextFocusIndex(2, 4), 3);
  assert.equal(nextFocusIndex(3, 4), 0);
  assert.equal(nextFocusIndex(0, 0), -1);
});
