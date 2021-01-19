var actualScale, maskExpansion, pageLayer, pageScale, refLayer, refLayerName, refScale;

refLayerName = 'REF_LAYER_NAME';

refLayer = thisComp.layer(refLayerName);

pageLayer = refLayer.parent;

maskExpansion = refLayer.mask('Mask 1').maskExpansion.value;

refScale = refLayer.transform.scale[0];

pageScale = pageLayer.transform.scale[0];

actualScale = refScale * pageScale / 100;

maskExpansion * actualScale / 100;
