const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ChevronDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M6 9l6 6 6-6" /></svg>
);
export const Plus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M5 12h14" /></svg>
);
export const SunIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const CalendarIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M3 4h2l2.4 11h10.2L20 7H6" /><circle cx="9" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></svg>
);
export const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
