// Expression for Opacity keyframing:
if (marker.numKeys > 0){
  m = marker.nearestKey(time);
  t = m.time;
  o = comp(“Controller”).layer(“Control Layer”).effect(“Slider Control”)(“Slider”);
  d = comp(“Controller”).layer(“Control Layer”).effect(“Slider Control”)(“Slider”);
  if (m.index%2){
  	// Do this on the first marker (and every odd marker after)
    ease(time,t,t-d*thisComp.frameDuration,0,o)
  }else{
  	// Do this on the second marker (and every even marker after)
    ease(time,t,t+d*thisComp.frameDuration,o,0)
  }
}else{
  value
}

// Expression for Feather keyframing:
if (marker.numKeys > 0){
  m = marker.nearestKey(time);
  t = m.time;
  d = comp(“Controller”).layer(“Control Layer”).effect(“Slider Control”)(“Slider”);
  f = comp(“Controller”).layer(“Control Layer”).effect(“Slider Control”)(“Slider”);
  if (m.index%2){
  	// Do this on the first marker (and every odd marker after)
    ease(time,t,t-d*thisComp.frameDuration,300,f)
  }else{
  	// Do this on the second marker (and every even marker after)
    ease(time,t,t+d*thisComp.frameDuration,f,300)
  }
}else{
  value
}