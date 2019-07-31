var popupVal;

popupVal = effect('AV Highlighter')('Highlight Colour').value;

switch (popupVal) {
  case 1:
    [255, 221, 3, 255] / 255;
    break;
  case 2:
    [152, 218, 255, 255] / 255;
    break;
  case 3:
    [236, 152, 255, 255] / 255;
    break;
  case 4:
    [157, 255, 160, 255] / 255;
    break;
  case 5:
    [255, 152, 202, 255] / 255;
    break;
  case 6:
    [255, 175, 104, 255] / 255;
    break;
  default:
    [255, 157, 157, 255] / 255;
}
