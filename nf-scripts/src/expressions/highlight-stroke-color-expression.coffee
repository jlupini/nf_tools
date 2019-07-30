# This expression is checking for which item in the selector is picked.
# The order is determined by the pseudo effect order. 

popup_val = effect('AV Highlighter')('Highlight Colour')
if popup_val == 1
  [255,221,3,255] / 255
else if popup_val == 2
  [152,218,255,255] / 255
else if popup_val == 3
  [236,152,255,255] / 255
else if popup_val == 4
  [157,255,160,255] / 255
else if popup_val == 5
  [255,152,202,255] / 255
else if popup_val == 6
  [255,175,104,255] / 255
else
  [255,157,157,255] / 255
