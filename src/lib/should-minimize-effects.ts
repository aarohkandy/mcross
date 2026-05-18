type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

export function shouldMinimizeEffects(reducedMotion?: MediaQueryList) {
  if (typeof window === "undefined") {
    return false;
  }

  const motionQuery =
    reducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigatorWithHints = navigator as NavigatorWithHints;
  const hasLowDeviceMemory =
    typeof navigatorWithHints.deviceMemory === "number" &&
    navigatorWithHints.deviceMemory <= 4;
  const hasLowCoreCount =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency <= 4;

  return (
    motionQuery.matches ||
    navigatorWithHints.connection?.saveData === true ||
    hasLowDeviceMemory ||
    hasLowCoreCount
  );
}
