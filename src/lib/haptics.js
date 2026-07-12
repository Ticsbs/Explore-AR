// Haptic feedback utility (where supported)
export function hapticFeedback(pattern = 10) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

export function hapticTap() {
  hapticFeedback(10);
}

export function hapticSuccess() {
  hapticFeedback([10, 30, 10]);
}

export function hapticError() {
  hapticFeedback([50, 30, 50]);
}