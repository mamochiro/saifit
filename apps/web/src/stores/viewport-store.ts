import { create } from "zustand";

interface ViewportState {
  keyboardHeight: number;
  keyboardOpen: boolean;
}

interface ViewportActions {
  init: () => () => void; // returns cleanup fn
}

export const useViewportStore = create<ViewportState & ViewportActions>()((set) => ({
  keyboardHeight: 0,
  keyboardOpen: false,

  init: () => {
    if (typeof window === "undefined") return () => {};

    const vv = window.visualViewport;
    if (!vv) return () => {};

    const handler = () => {
      const windowHeight = window.innerHeight;
      const viewportHeight = vv.height ?? windowHeight;
      const diff = windowHeight - viewportHeight - (vv.offsetTop ?? 0);
      const kbHeight = Math.max(0, diff);
      set({
        keyboardHeight: kbHeight,
        keyboardOpen: kbHeight > 80,
      });
    };

    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);

    return () => {
      vv.removeEventListener("resize", handler);
      vv.removeEventListener("scroll", handler);
    };
  },
}));
