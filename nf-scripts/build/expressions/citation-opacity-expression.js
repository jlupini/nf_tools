var duration, m, progress;

if (thisLayer.marker.numKeys > 0) {
  m = thisLayer.marker.nearestKey(time);
  duration = 1.0;
  if (m.duration / 2 < duration) {
    duration = m.duration / 2;
  }
  if ((m.time <= time && time < m.time + duration)) {
    progress = time - m.time;
    progress / duration * 100;
  } else if ((m.time + duration <= time && time < m.time + m.duration - duration)) {
    100;
  } else if ((m.time + m.duration - duration <= time && time < m.time + m.duration)) {
    progress = m.time + m.duration - time;
    progress / duration * 100;
  } else {
    0;
  }
} else {
  0;
}
