import { Music2 } from "lucide-react";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: {
      icon: "h-8 w-8",
      text: "text-xl",
      sub: "text-[10px]",
    },
    md: {
      icon: "h-10 w-10",
      text: "text-2xl",
      sub: "text-xs",
    },
    lg: {
      icon: "h-14 w-14",
      text: "text-4xl",
      sub: "text-sm",
    },
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizes[size].icon} flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md`}
      >
        <Music2 className="h-1/2 w-1/2" />
      </div>

      <div className="leading-none">
        <h1 className={`${sizes[size].text} font-bold tracking-tight`}>
          Songify
        </h1>
        <p className={`${sizes[size].sub} mt-1 text-muted-foreground`}>
          Your music. Your queue.
        </p>
      </div>
    </div>
  );
}