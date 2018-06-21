
/**
The possible easing equations for {@linkcode NFLayer#addInOutMarkersForProperty}
@global
@constant
@property linear
@property quint
@property expo
@property elastic
@property bounce
@property quad
@property quart
@property sine
@property circ
@property back
 */
var EasingEquation;

EasingEquation = {
  linear: "function(t, b, c, d) {return c * t / d + b;}",
  quint: {
    "in": "function(t, b, c, d) {return c * (t/=d) * t * t * t * t + b;}",
    out: "function(t, b, c, d) {return c * ((t = t / d - 1) * t * t * t * t + 1) + b;}",
    inOut: "function(t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b;}"
  },
  quart: {
    "in": "function(t, b, c, d) { return c*(t/=d)*t*t*t + b; }",
    out: "function(t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }",
    inOut: "function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; }"
  },
  sine: {
    "in": "function(t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; }",
    out: "function(t, b, c, d) { return c * Math.sin(t/d * (Math.PI/2)) + b; }",
    inOut: "function (t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; }"
  },
  quad: {
    "in": "function(t, b, c, d) { return c*(t/=d)*t + b; }",
    out: "function(t, b, c, d) { return -c *(t/=d)*(t-2) + b; }",
    inOut: "function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t + b; return -c/2 * ((--t)*(t-2) - 1) + b; }"
  },
  circ: {
    "in": "function(t, b, c, d) { return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; }",
    out: "function(t, b, c, d) { return c * Math.sqrt(1 - (t=t/d-1)*t) + b; }",
    inOut: "function(t, b, c, d) { if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; }"
  },
  back: {
    "in": "function(t, b, c, d) { var s = 1.70158;	// overshoot amount\n return c*(t/=d)*t*((s+1)*t - s) + b; }",
    out: "function(t, b, c, d) { var s = 1.70158;	// overshoot amount\n return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; }",
    inOut: "function(t, b, c, d) { var s = 1.70158;	// overshoot amount\n if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; }"
  },
  bounce: {
    "in": "function(t, b, c, d) { function outBounce(t, b, c, d) { if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b } } return c - outBounce (d-t, 0, c, d) + b; }",
    out: "function(t, b, c, d) { if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b } }",
    inOut: "function(t, b, c, d) { function outBounce(t, b, c, d) { if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b } } function inBounce(t, b, c, d) { return c - outBounce (d-t, 0, c, d) + b; } if (t < d/2) return inBounce (t*2, 0, c, d) * .5 + b; else return outBounce (t*2-d, 0, c, d) * .5 + c*.5 + b; }"
  },
  expo: {
    "in": "function(t, b, c, d) { var IN_EXPO_CORRECTION = 0.000976; return t==0 ? b : c * (Math.pow(2, 10 * (t/d - 1)) - IN_EXPO_CORRECTION) + b; }",
    out: "function(t, b, c, d) { var OUT_EXPO_CORRECTION = 1.000976; return (t==d) ? b+c : c * OUT_EXPO_CORRECTION * (-Math.pow(2, -10 * t/(d)) + 1) + b; }",
    inOut: "function(t, b, c, d) { var CORRECTION = .000976563; var v; if ((t/=d/2) < 1) { v = Math.pow(2, 10 * (t - 1)) - CORRECTION; } else { v = (-Math.pow(2, -10 * (t - 1)) + 2) + CORRECTION; } return b + (v/2) * c; }"
  },
  elastic: {
    "in": "function(t, b, c, d) { var p = 0.81;		// period\n var a = 50;		// amplitude\n if (t==0) return b;  if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a || a < Math.abs(c)) { a=c;  s=p/4; } else s = p/(2*Math.PI) * Math.asin (c/a); return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; }",
    out: "function(t, b, c, d) { var p = 0.81;		// period\n var a = 50;		// amplitude\n if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin (c/a); return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b); }",
    inOut: "function(t, b, c, d) { var p = 0.81;		// period\n var a = 50;		// amplitude\n if (t==0) return b;  if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5); if (!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; }"
  }
};
