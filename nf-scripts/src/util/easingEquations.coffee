###*
The possible easing equations for {@linkcode Property#makeEasedInOutFromMarkers}
@global
@constant
@property in_quint
@property out_quint
###
app.NF.Util.easingEquations =
  in_quint: "c * (t/=d) * t * t * t * t + b"
  out_quint: "c * ((t = t / d - 1) * t * t * t * t + 1) + b"
