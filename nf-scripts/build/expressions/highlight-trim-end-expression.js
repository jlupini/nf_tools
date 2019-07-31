var endOffset, grossPoints, lineCount, maxPercent, minPercent, pointsPerLine, sliderVal, startOffset, thisLine, totalPercent, totalPoints;

lineCount = LINE_COUNT;

thisLine = THIS_LINE;

sliderVal = effect('AV Highlighter')('Completion') / 10;

startOffset = effect('AV Highlighter')('Start Offset');

endOffset = effect('AV Highlighter')('End Offset');

totalPoints = lineCount * 100;

grossPoints = totalPoints - startOffset - endOffset;

pointsPerLine = grossPoints / lineCount * 100;

totalPercent = (sliderVal / 100 * grossPoints + startOffset) / totalPoints * 100;

minPercent = 100 / lineCount * (thisLine - 1);

maxPercent = 100 / lineCount * thisLine;

if (totalPercent <= minPercent) {
  0;
} else if (totalPercent >= maxPercent) {
  100;
} else {
  (totalPercent - minPercent) / (maxPercent - minPercent) * 100;
}
