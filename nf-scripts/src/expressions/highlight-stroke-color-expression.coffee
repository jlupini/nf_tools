# This expression is checking for which item in the selector is picked.
# The order is determined by the pseudo effect order.

popupVal = effect('AV Highlighter')('Highlight Colour').value

switch popupVal
  when 1 then [255,221,3,255] / 255
  when 2 then [152,218,255,255] / 255
  when 3 then [236,152,255,255] / 255
  when 4 then [157,255,160,255] / 255
  when 5 then [255,152,202,255] / 255
  when 6 then [255,175,104,255] / 255
  else [255,157,157,255] / 255
