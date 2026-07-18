const paths = {
  pulse: 'M2 12h4l2.5-7 4 14 3-9 2 2h4.5',
  clipboard: 'M9 4h6a1 1 0 0 1 1 1v1h1.5A1.5 1.5 0 0 1 19 7.5v12A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-12A1.5 1.5 0 0 1 6.5 6H8V5a1 1 0 0 1 1-1zM9 5v2h6V5H9zm-1 8h8m-8 4h5',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  check: 'M5 13l4 4L19 7',
  alert: 'M12 3l10 18H2L12 3zm0 7v4m0 3.2h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 7 18a3 3 0 0 0 5-2.2V6a2 2 0 0 0-3-2zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17 18a3 3 0 0 1-5-2.2V6a2 2 0 0 1 3-2z',
  thermometer: 'M12 3a2 2 0 0 0-2 2v9.3a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2zm0 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',
  lungs: 'M12 3v7m0 0c-1-2-3-3-5-3-3 0-4 3-4 6 0 3 1 6 3 6 2 0 3-1.5 3-4v-2m3 -3c1-2 3-3 5-3 3 0 4 3 4 6 0 3-1 6-3 6-2 0-3-1.5-3-4v-2',
  stomach: 'M8 4c0 3-3 4-3 8a7 7 0 0 0 14 0c0-2-1-3-1-5s1-2 1-3-1-2-3-2c-2 3-2 3-4 3s-2 0-4-3z',
  refresh: 'M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0 1 19 12M18.5 15A7 7 0 0 1 5 12',
  file: 'M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 0v5h5',
  flag: 'M6 21V4h12l-3 4 3 4H6',
}

export default function Icon({ name, size = 20, strokeWidth = 1.8, className = '' }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      className={`icon icon-${name} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}
