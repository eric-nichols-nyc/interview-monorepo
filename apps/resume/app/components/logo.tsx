export type LogoProps = {
  /**
   * If true, render just the mark (icon orb) with no text.
   * Use this in favicons, mobile nav, etc.
   */
  compact?: boolean;

  /**
   * If true, render just the text with no orb.
   * Use this when you want wordmark only.
   */
  textOnly?: boolean;

  /**
   * Controls text color for "Resum" and "te".
   * Defaults to slate-900 / white depending on dark mode,
   * but you can override with any Tailwind text-* class.
   */
  className?: string;

  /**
   * Size in pixels for the icon height.
   * Text will scale proportionally via text-[size].
   */
  size?: number;
};

export function Logo({
  compact = false,
  textOnly = false,
  className = "",
  size = 28,
}: LogoProps) {
  // We'll derive text size from the icon size.
  // Example: size=28 -> ~text-xl
  let textSizeClass: string;
  if (size >= 40) {
    textSizeClass = "text-2xl";
  } else if (size >= 32) {
    textSizeClass = "text-xl";
  } else if (size >= 28) {
    textSizeClass = "text-lg";
  } else if (size >= 24) {
    textSizeClass = "text-base";
  } else {
    textSizeClass = "text-sm";
  }

  // If textOnly, render just the wordmark
  if (textOnly) {
    return (
      <div
        className={`flex items-baseline font-semibold leading-none tracking-tight ${textSizeClass} ${className}text-slate-900 dark:text-slate-100`}
      >
        {/* "Resum" */}
        <span>Resum</span>

        {/* "AI" accent */}
        <span className="relative mx-[1px] font-bold">
          <span className="bg-gradient-to-br from-purple-900 via-violet-700 to-fuchsia-700 bg-clip-text text-transparent">
            AI
          </span>

          {/* Glow behind AI letters */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 blur-md"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.5) 0%, rgba(16,185,129,0.5) 60%, transparent 70%)",
            }}
          />
        </span>

        {/* "te" */}
        <span>te</span>
      </div>
    );
  }

  return (
    <div className="flex select-none items-center gap-2">
      {/* Mark / Orb */}
      <div
        className="relative flex items-center justify-center rounded-2xl shadow-lg ring-1 ring-black/10 dark:ring-white/10"
        style={{
          height: size,
          width: size,
          // darker gradient with richer AI colors
          background:
            "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.7) 0%, rgba(139,92,246,0.5) 40%, rgba(0,0,0,0.3) 70%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.6) 0%, rgba(5,150,105,0.4) 50%, rgba(0,0,0,0) 70%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* Little sparkle/star mark inside the orb */}
        <svg
          aria-label="ResumAIte sparkle icon"
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
            // bright core for AI feel
            d="M12 3.5L13.9 9.1L19.5 11L13.9 12.9L12 18.5L10.1 12.9L4.5 11L10.1 9.1L12 3.5Z"
          />
        </svg>

        {/* subtle outer glow ring */}
        <div
          className="pointer-events-none absolute rounded-2xl opacity-40 blur-md"
          style={{
            inset: "-30%",
            background:
              "conic-gradient(from 0deg, rgba(16,185,129,0.6), rgba(168,85,247,0.6), rgba(16,185,129,0.6))",
          }}
        />
      </div>

      {/* Wordmark */}
      {!compact && (
        <div
          className={`flex items-baseline font-semibold leading-none tracking-tight ${textSizeClass} ${className}text-slate-900 dark:text-slate-100`}
        >
          {/* "Resum" */}
          <span>Resum</span>

          {/* "AI" accent */}
          <span className="relative mx-[1px] font-bold">
            <span className="bg-gradient-to-br from-purple-900 via-violet-700 to-fuchsia-700 bg-clip-text text-transparent">
              AI
            </span>

            {/* Glow behind AI letters */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30 blur-md"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.5) 0%, rgba(16,185,129,0.5) 60%, transparent 70%)",
              }}
            />
          </span>

          {/* "te" */}
          <span>te</span>
        </div>
      )}
    </div>
  );
}
