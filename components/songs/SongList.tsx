import Link from "next/link";
import { Music2, Radio, AudioWaveform } from "lucide-react";

import { PlaySongButton } from "@/components/songs/PlaySongButton";
import { Button } from "@/components/ui/button";
import { PlayerSong } from "@/store/playstore";

type SongItem = PlayerSong & {
  playCount: number;
  createdAt: string;
};

type SongListProps = {
  songs: SongItem[];
};

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* Deterministic hue shift per track so each artwork blob feels unique */
function trackHue(index: number) {
  const hues = [300, 190, 150, 80, 25, 260, 340, 60];
  return hues[index % hues.length];
}

export function SongList({ songs }: SongListProps) {
  /* ── Empty state ── */
  if (songs.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-border/60 bg-card/40 text-center backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 via-accent to-secondary">
          <Radio className="h-9 w-9 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">No tracks yet</h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Once the admin uploads songs into this folder they will appear here.
          </p>
        </div>
        <Link href="/admin/upload">
          <Button variant="outline" className="rounded-full px-6">
            Upload as Admin
          </Button>
        </Link>
      </div>
    );
  }

  const playerSongs: PlayerSong[] = songs.map(({ _id, title, audioUrl, duration, playCount, createdAt }) => ({
    _id, title, audioUrl, duration, playCount, createdAt,
  }));

  return (
    /* Extra bottom padding so the sticky player doesn't obscure the last track */
    <div className="space-y-1 pb-32">
      {/* Column header */}
      <div className="mb-3 hidden grid-cols-[2rem_3rem_1fr_6rem_3rem_3rem] items-center gap-4 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 sm:grid">
        <span>#</span>
        <span />
        <span>Title</span>
        <span className="text-right">Plays</span>
        <span className="text-right">Time</span>
        <span />
      </div>

      {songs.map((song, index) => {
        const hue = trackHue(index);

        return (
          <div
            key={song._id}
            className="song-row group relative grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-card/70 sm:grid-cols-[2rem_3rem_1fr_6rem_3rem_3rem] sm:gap-4 sm:px-4"
          >
            {/* Track number */}
            <span className="hidden w-8 text-center text-sm text-muted-foreground/50 tabular-nums transition-opacity group-hover:opacity-0 sm:block">
              {index + 1}
            </span>

            {/* Artwork thumbnail */}
            <div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
              style={{
                background: `radial-gradient(circle at 30% 30%, oklch(0.65 0.20 ${hue} / 0.35), oklch(0.55 0.10 ${hue} / 0.15))`,
                boxShadow: `0 2px 12px oklch(0.65 0.20 ${hue} / 0.20)`,
              }}
            >
              <Music2
                className="h-5 w-5 transition-opacity group-hover:opacity-0"
                style={{ color: `oklch(0.70 0.22 ${hue})` }}
              />
              {/* Waveform pulse on hover */}
              <AudioWaveform
                className="absolute h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: `oklch(0.70 0.22 ${hue})` }}
              />
            </div>

            {/* Title */}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                {song.title}
              </h3>
              {/* Mobile-only meta */}
              <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                {formatDuration(song.duration)} · {song.playCount} plays
              </p>
            </div>

            {/* Play count – desktop */}
            <p className="hidden text-right text-xs tabular-nums text-muted-foreground sm:block">
              {song.playCount.toLocaleString()}
            </p>

            {/* Duration – desktop */}
            <p className="hidden text-right text-xs tabular-nums text-muted-foreground sm:block">
              {formatDuration(song.duration)}
            </p>

            {/* Play button */}
            <div className="flex justify-end">
              <PlaySongButton
                song={{
                  _id: song._id,
                  title: song.title,
                  audioUrl: song.audioUrl,
                  duration: song.duration,
                  playCount: song.playCount,
                  createdAt: song.createdAt,
                }}
                songs={playerSongs}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}