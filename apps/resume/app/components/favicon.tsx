export type FaviconProps = {
  size?: number;
};

export function Favicon({ size = 40 }: FaviconProps) {
  return (
    <div
      className="relative flex select-none items-center justify-center rounded-2xl shadow-lg ring-1 ring-black/10 dark:ring-white/10"
      style={{
        height: size,
        width: size,
        background:
          "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.7) 0%, rgba(139,92,246,0.5) 40%, rgba(0,0,0,0.3) 70%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.6) 0%, rgba(5,150,105,0.4) 50%, rgba(0,0,0,0) 70%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Core sparkle */}
      <svg
        aria-label="ResumAIte favicon icon"
        className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        fill="none"
        height={Math.round(size * 0.5)}
        role="img"
        viewBox="0 0 24 24"
        width={Math.round(size * 0.5)}
      >
        <title>ResumAIte</title>
        <path
          className="fill-white"
          d="M12 3.5L13.9 9.1L19.5 11L13.9 12.9L12 18.5L10.1 12.9L4.5 11L10.1 9.1L12 3.5Z"
        />
      </svg>

      {/* Outer glow ring */}
      <div
        className="pointer-events-none absolute rounded-2xl opacity-40 blur-md"
        style={{
          inset: "-30%",
          background:
            "conic-gradient(from 0deg, rgba(16,185,129,0.6), rgba(168,85,247,0.6), rgba(16,185,129,0.6))",
        }}
      />
    </div>
  );
}
