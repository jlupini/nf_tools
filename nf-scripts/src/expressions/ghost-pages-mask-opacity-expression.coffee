maskNumber = thisProperty.propertyGroup(1).propertyIndex - 1
paperNumber = Math.floor(maskNumber / 2)
sheetNumber = maskNumber % 2
opacityValue = thisLayer.effect("Page Opacity")("Slider").value

opacityValue - (sheetNumber * 0.2)
