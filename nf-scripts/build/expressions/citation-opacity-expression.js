var duration, m, prevKey, progress, timeToEndOfPrevKey, timeToNearestKey;

if (thisLayer.marker.numKeys > 0) {
  m = thisLayer.marker.nearestKey(time);
  if (time < m.time && m.index !== 1) {
    prevKey = thisLayer.marker.key(m.index - 1);
    timeToNearestKey = m.time - time;
    timeToEndOfPrevKey = time - (prevKey.time + prevKey.duration);
    if (timeToEndOfPrevKey < timeToNearestKey) {
      m = prevKey;
    }
  }
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
