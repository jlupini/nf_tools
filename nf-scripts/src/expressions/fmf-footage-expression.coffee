isPos = thisProperty.name is "Position"
isScale = thisProperty.name is "Scale"

if isPos
  fullscreenDefaultPosition = thisLayer.effect("Fullscreen Default Position")("Point").value
  splitscreenDefaultPosition = thisLayer.effect("Splitscreen Default Position")("Point").value
if isScale
  fullscreenDefaultScaleFactor = thisLayer.effect("Fullscreen Default Scale")("Slider").value
  splitscreenDefaultScaleFactor = thisLayer.effect("Splitscreen Default Scale")("Slider").value

easeInOutCubic = (t) ->
  if t < 0.5 then 4*t*t*t else (t-1)*(2*t-2)*(2*t-2)+1

# Get the active slides right now
numLayers = thisComp.numLayers
activeSlides = []
calcVal = null
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  if theLayer.active
    try
      transitionType = theLayer.effect("Transition Type")
    activeSlides.push theLayer if transitionType?
    transitionType = null
  break if activeSlides.length is 2
  i++

# # Get the relevant marker
# if theLayer.marker.numKeys > 0
#   for idx in [1..theLayer.marker.numKeys]
#     testMarker = theLayer.marker.key(idx)
#     if testMarker.comment is "NF In"
#       inMarker = testMarker
#     if testMarker.comment is "NF Out"
#       outMarker = testMarker
#
# try
#   switch theLayer.effect("Transition Type")("Menu").value
#     when 3 # Custom
#       targetPosVal = theLayer.effect("Position Override")("Point").value if isPos
#       targetScaleFactor = theLayer.effect("Scale Override")("Slider").value if isScale
#     when 2 # Splitscreen
#       targetPosVal = splitscreenDefaultPosition if isPos
#       targetScaleFactor = splitscreenDefaultScaleFactor if isScale
#     when 1 # Fullscreen
#       targetPosVal = fullscreenDefaultPosition if isPos
#       targetScaleFactor = fullscreenDefaultScaleFactor if isScale
#     else
#       throw new Error "Uncaught Transition Type value"
#
  # if inMarker? and theLayer.inPoint <= time < inMarker.time
  #   shouldUseInTransition = yes
  #   progress = 1 - easeInOutCubic((time - theLayer.inPoint) / (inMarker.time - theLayer.inPoint))
  # if outMarker? and theLayer.outPoint >= time > outMarker.time
  #   shouldUseOutTransition = yes
  #   progress = 1 - easeInOutCubic((time - theLayer.outPoint) / (outMarker.time - theLayer.outPoint))

  # if shouldUseInTransition or shouldUseOutTransition
  #   if isPos
  #     deltaX = value[0] - targetPosVal[0]
  #     deltaY = value[1] - targetPosVal[1]
  #     calcVal = [targetPosVal[0] + deltaX * progress, targetPosVal[1] + deltaY * progress]
  #   if isScale
  #     deltaScale = value[0] - targetScaleFactor
  #     calcValFactor = targetScaleFactor + deltaScale * progress
  #     calcVal = [calcValFactor, calcValFactor]
  # else
  #   if isPos
  #     calcVal = targetPosVal
  #   else if isScale
  #     calcVal = [targetScaleFactor, targetScaleFactor]

unless activeSlides.length is 0
  activeSlideInfo = []
  for thisSlide in activeSlides
    obj = {}
    try
      switch thisSlide.effect("Transition Type")("Menu").value
        when 3 # Custom
          obj.targetPosVal = thisSlide.effect("Position Override")("Point").value if isPos
          obj.targetScaleFactor = thisSlide.effect("Scale Override")("Slider").value if isScale
        when 2 # Splitscreen
          obj.targetPosVal = splitscreenDefaultPosition if isPos
          obj.targetScaleFactor = splitscreenDefaultScaleFactor if isScale
        when 1 # Fullscreen
          obj.targetPosVal = fullscreenDefaultPosition if isPos
          obj.targetScaleFactor = fullscreenDefaultScaleFactor if isScale
        else
          throw new Error "Uncaught Transition Type value"

    activeSlideInfo.push obj

  switch activeSlides.length
    when 1
      thisSlide = activeSlides[0]

      if thisSlide.marker.numKeys > 0
        for idx in [1..thisSlide.marker.numKeys]
          testMarker = thisSlide.marker.key(idx)
          if testMarker.comment is "NF In"
            inMarker = testMarker
          if testMarker.comment is "NF Out"
            outMarker = testMarker

      if inMarker? and thisSlide.inPoint <= time < inMarker.time
        isTransitioning = yes
        progress = 1 - easeInOutCubic((time - thisSlide.inPoint) / (inMarker.time - thisSlide.inPoint))
      if outMarker? and thisSlide.outPoint >= time > outMarker.time
        isTransitioning = yes
        progress = 1 - easeInOutCubic((time - thisSlide.outPoint) / (outMarker.time - thisSlide.outPoint))
    when 2
      if activeSlides[0].inPoint < activeSlides[1].inPoint
        slide1 = activeSlides[0]
        slide2 = activeSlides[1]
        slide1Info = activeSlideInfo[0]
        slide2Info = activeSlideInfo[1]
      else
        slide1 = activeSlides[1]
        slide2 = activeSlides[0]
        slide1Info = activeSlideInfo[1]
        slide2Info = activeSlideInfo[0]
      if slide2.inPoint <= time <= slide1.outPoint
        isTransitioning = yes
        progress = 1 - easeInOutCubic((time - slide2.inPoint) / (slide1.outPoint - slide2.inPoint))

    else
      throw new Error "Too many slides active at same time"

  if isTransitioning
    if activeSlides.length is 1
      if isPos
        deltaX = value[0] - activeSlideInfo[0].targetPosVal[0]
        deltaY = value[1] - activeSlideInfo[0].targetPosVal[1]
        calcVal = [activeSlideInfo[0].targetPosVal[0] + deltaX * progress, activeSlideInfo[0].targetPosVal[1] + deltaY * progress]
      if isScale
        deltaScale = value[0] - activeSlideInfo[0].targetScaleFactor
        calcValFactor = activeSlideInfo[0].targetScaleFactor + deltaScale * progress
        calcVal = [calcValFactor, calcValFactor]
    else if activeSlides.length is 2
      if isPos
        deltaX = slide1Info.targetPosVal[0] - slide2Info.targetPosVal[0]
        deltaY = slide1Info.targetPosVal[1] - slide2Info.targetPosVal[1]
        calcVal = [slide2Info.targetPosVal[0] + deltaX * progress, slide2Info.targetPosVal[1] + deltaY * progress]
      if isScale
        deltaScale = slide1Info.targetScaleFactor - slide2Info.targetScaleFactor
        calcValFactor = slide2Info.targetScaleFactor + deltaScale * progress
        calcVal = [calcValFactor, calcValFactor]

  else
    if isPos
      calcVal = activeSlideInfo[0].targetPosVal
    else if isScale
      calcVal = [activeSlideInfo[0].targetScaleFactor, activeSlideInfo[0].targetScaleFactor]


calcVal ? value
