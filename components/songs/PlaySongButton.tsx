"use client";

import { Pause, Play } from "lucide-react";

import { PlayerSong, usePlayerStore } from "@/store/playstore";

type PlaySongButtonProps = {
  song: PlayerSong;
  songs: PlayerSong[];
};

export function PlaySongButton({ song, songs }: PlaySongButtonProps) {
  const { playSong, currentSong, isPlaying, setIsPlaying } = usePlayerStore();

  const isThisSong = currentSong?._id === song._id;
  const isActive = isThisSong && isPlaying;

  function handleClick() {
    if (isThisSong) {
      // Toggle play/pause for the currently loaded track
      setIsPlaying(!isPlaying);
    } else {
      playSong(song, songs);
    }
  }

  return (
    <button
      type="button"
      aria-label={isActive ? "Pause" : "Play"}
      onClick={handleClick}
      className={`
        group relative flex h-9 w-9 items-center justify-center rounded-full
        transition-all duration-200
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
            : "border border-border/60 bg-background/50 text-foreground/70 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        }
      `}
    >
      {isActive ? (
        <Pause className="h-3.5 w-3.5 fill-current" />
      ) : (
        <Play className="h-3.5 w-3.5 translate-x-px fill-current" />
      )}

      {/* Active pulse ring */}
      {isActive && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
      )}
    </button>
  );
}