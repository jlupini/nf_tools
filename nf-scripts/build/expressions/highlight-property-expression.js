var controlLayer, offsetTime, targetComp;

targetComp = comp('TARGET_COMP_NAME');

controlLayer = targetComp.layer('CONTROL_LAYER_NAME');

offsetTime = controlLayer.startTime;

controlLayer.effect('HIGHLIGHT_NAME')('HIGHLIGHTER_PROPERTY').valueAtTime(time + offsetTime);
