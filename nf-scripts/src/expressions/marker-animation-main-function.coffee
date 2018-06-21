startEquation = (t, b, c, d) ->
  return startEquationFunc t, b, c, d

endEquation =  (t, b, c, d) ->
  return endEquationFunc t, b, c, d

easeAndWizz = ->
  # Get the relevant marker
  if marker.numKeys > 0
    for idx in [1..marker.numKeys]
      testMarker = marker.key(idx)
      inMarker = testMarker if testMarker.comment is "NF In"
      outMarker = testMarker if testMarker.comment is "NF Out"
  else
    return null

  return null unless inMarker? or outMarker?

  # Figure out how many dimensions we're dealing with
  dimensionCount = 1
  # It's gotta have at least ONE dimension
  try
    value[1]
    dimensionCount = 2
    value[2]
    dimensionCount = 3
  catch e

  # Deal with before and after
  if inMarker? and inValue? and time < inPoint

    startValue = inValue
    try
      startValue[0]
    catch
      startValue = [startValue]

    sX = startValue[0]
    if dimensionCount>= 2
      sY = startValue[1]
      if dimensionCount>= 3
        sZ = startValue[2]

    switch dimensionCount
      when 1
        return sX
      when 2
        return [sX, sY]
      when 3
        return [sX, sY, sZ]
      else
        return null

  else if outMarker? and outValue? and time > outPoint

    endValue = outValue
    try
      endValue[0]
    catch
      endValue = [endValue]

    sX = endValue[0]
    if dimensionCount>= 2
      sY = endValue[1]
      if dimensionCount>= 3
        sZ = endValue[2]

    switch dimensionCount
      when 1
        return sX
      when 2
        return [sX, sY]
      when 3
        return [sX, sY, sZ]
      else
        return null

  # Deal with the Beginning Stuff
  else if inMarker? and inValue? and inPoint <= time <= inMarker.time

    startValue = inValue
    endValue = valueAtTime(inMarker.time)

    try
      startValue[0]
    catch e
      startValue = [startValue]
      endValue = [endValue]

    t = time - (inPoint)
    d = inMarker.time - (inPoint)
    sX = startValue[0]
    eX = endValue[0] - (startValue[0])
    if dimensionCount>= 2
      sY = startValue[1]
      eY = endValue[1] - (startValue[1])
      if dimensionCount>= 3
        sZ = startValue[2]
        eZ = endValue[2] - (startValue[2])

    val1 = startEquation(t, sX, eX, d)
    switch dimensionCount
      when 1
        return val1
      when 2
        val2 = startEquation(t, sY, eY, d)
        return [val1, val2]
      when 3
        val2 = startEquation(t, sY, eY, d)
        val3 = startEquation(t, sZ, eZ, d)
        return [val1, val2, val3]
      else
        return null

  # Deal with the Ending Stuff
  else if outMarker? and outValue? and outMarker.time <= time <= outPoint

    startValue = valueAtTime(outMarker.time)
    endValue = outValue
    try
      endValue[0]
    catch e
      startValue = [startValue]
      endValue = [endValue]

    t = time - outMarker.time
    d = outPoint - outMarker.time
    sX = startValue[0]
    eX = endValue[0] - (startValue[0])
    if dimensionCount>= 2
      sY = startValue[1]
      eY = endValue[1] - (startValue[1])
      if dimensionCount>= 3
        sZ = startValue[2]
        eZ = endValue[2] - (startValue[2])

    val1 = endEquation(t, sX, eX, d)
    switch dimensionCount
      when 1
        return val1
      when 2
        val2 = endEquation(t, sY, eY, d)
        return [val1, val2]
      when 3
        val2 = endEquation(t, sY, eY, d)
        val3 = endEquation(t, sZ, eZ, d)
        return [val1, val2, val3]
      else
        return null

  return null

easeAndWizz() ? value
