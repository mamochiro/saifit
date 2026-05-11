import type React from "react";

export const ANIM_TIMING = "2.5s";
export const KEY_TIMES = "0; 0.16; 0.40; 0.52; 0.84; 1";
export const KEY_SPLINES = ".25 .1 .25 1; .25 .1 .25 1; .42 0 .58 1; .42 0 .58 1; .25 .1 .25 1";
export const STROKE = "rgba(255,255,255,0.85)";

export function smilD(values: string): React.SVGProps<SVGAnimateElement> {
  return {
    attributeName: "d",
    dur: ANIM_TIMING,
    repeatCount: "indefinite",
    values,
    keyTimes: KEY_TIMES,
    calcMode: "spline",
    keySplines: KEY_SPLINES,
  } as React.SVGProps<SVGAnimateElement>;
}

export function smilAttr(attr: string, values: string): React.SVGProps<SVGAnimateElement> {
  return {
    attributeName: attr,
    dur: ANIM_TIMING,
    repeatCount: "indefinite",
    values,
    keyTimes: KEY_TIMES,
    calcMode: "spline",
    keySplines: KEY_SPLINES,
  } as React.SVGProps<SVGAnimateElement>;
}
