import Link from "next/link";
import { Music2 } from "lucide-react";

type FolderCardProps = {
  folder: {
    _id: string;
    name: string;
    slug: string;
    cloudinaryFolderPath: string;
    createdAt: string;
  };
  index?: number;
};

const PALETTE = [
  { bg: "bg-violet-500/15", text: "text-violet-500", border: "border-violet-500/30", dot: "bg-violet-500", hover: "hover:border-violet-500/60 hover:bg-violet-500/10" },
  { bg: "bg-sky-500/15",    text: "text-sky-500",    border: "border-sky-500/30",    dot: "bg-sky-500",    hover: "hover:border-sky-500/60 hover:bg-sky-500/10" },
  { bg: "bg-emerald-500/15",text: "text-emerald-500",border: "border-emerald-500/30",dot: "bg-emerald-500",hover: "hover:border-emerald-500/60 hover:bg-emerald-500/10" },
  { bg: "bg-amber-500/15",  text: "text-amber-500",  border: "border-amber-500/30",  dot: "bg-amber-500",  hover: "hover:border-amber-500/60 hover:bg-amber-500/10" },
  { bg: "bg-rose-500/15",   text: "text-rose-500",   border: "border-rose-500/30",   dot: "bg-rose-500",   hover: "hover:border-rose-500/60 hover:bg-rose-500/10" },
  { bg: "bg-pink-500/15",   text: "text-pink-500",   border: "border-pink-500/30",   dot: "bg-pink-500",   hover: "hover:border-pink-500/60 hover:bg-pink-500/10" },
  { bg: "bg-cyan-500/15",   text: "text-cyan-500",   border: "border-cyan-500/30",   dot: "bg-cyan-500",   hover: "hover:border-cyan-500/60 hover:bg-cyan-500/10" },
  { bg: "bg-orange-500/15", text: "text-orange-500", border: "border-orange-500/30", dot: "bg-orange-500", hover: "hover:border-orange-500/60 hover:bg-orange-500/10" },
];

export function FolderCard({ folder, index = 0 }: FolderCardProps) {
  const color = PALETTE[index % PALETTE.length];
  const num = String(index + 1).padStart(2, "0");
  const date = new Date(folder.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/folder/${folder.slug}`}
      className={`
        group flex items-center gap-5 rounded-2xl border px-5 py-4
        bg-background/50 backdrop-blur transition-all duration-200
        ${color.border} ${color.hover}
        hover:-translate-y-[1px] hover:shadow-lg
      `}
    >
      {/* Color number badge */}
      <div
        className={`
          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
          text-lg font-bold tabular-nums
          ${color.bg} ${color.text}
        `}
      >
        {num}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold leading-snug">
          {folder.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
      </div>

      {/* Music icon + arrow */}
      <div className="flex shrink-0 items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color.bg}`}>
          <Music2 className={`h-4 w-4 ${color.text}`} />
        </div>
        <svg
          className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${color.text}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}