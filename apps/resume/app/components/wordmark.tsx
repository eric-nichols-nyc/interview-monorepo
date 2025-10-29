export type WordmarkProps = {
  className?: string;
  size?: number;
};

export function Wordmark({ className = "", size = 32 }: WordmarkProps) {
  let textSizeClass: string;
  if (size >= 40) {
    textSizeClass = "text-3xl";
  } else if (size >= 32) {
    textSizeClass = "text-2xl";
  } else if (size >= 24) {
    textSizeClass = "text-xl";
  } else {
    textSizeClass = "text-base";
  }

  return (
    <div
      className={`flex items-baseline font-semibold leading-none tracking-tight ${textSizeClass} ${className}text-slate-900 dark:text-slate-100`}
    >
      {/* "Resum" */}
      <span>Resum</span>

      {/* "AI" accent */}
      <span className="relative mx-[1px] font-bold">
        <span className="bg-gradient-to-br from-emerald-500 via-emerald-300 to-violet-600 bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]">
          AI
        </span>
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
