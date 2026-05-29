"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Music2,
} from "lucide-react";

import { usePlayerStore } from "@/store/playstore";

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds) || !Number.isFinite(seconds))
    return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Shared class string for native range inputs */
const rangeClass = `
  cursor-pointer appearance-none bg-transparent
  [&::-webkit-slider-runnable-track]:h-[3px]
  [&::-webkit-slider-runnable-track]:rounded-full
  [&::-webkit-slider-runnable-track]:bg-transparent
  [&::-webkit-slider-thumb]:mt-[-5px]
  [&::-webkit-slider-thumb]:h-[13px]
  [&::-webkit-slider-thumb]:w-[13px]
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:shadow-md
  [&::-webkit-slider-thumb]:transition-transform
  [&::-webkit-slider-thumb]:hover:scale-125
  [&::-moz-range-thumb]:h-[13px]
  [&::-moz-range-thumb]:w-[13px]
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:border-0
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:shadow-md
`;

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    clearPlayer,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Slide-in animation trigger */
  useEffect(() => {
    if (currentSong) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [currentSong]);

  /* Load new song */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    setCurrentTime(0);
    setDuration(0);
    audio.pause();
    audio.src = currentSong.audioUrl;
    audio.volume = muted ? 0 : volume;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentSong]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Play / pause sync */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    isPlaying ? audio.play().catch(() => setIsPlaying(false)) : audio.pause();
  }, [isPlaying, currentSong, setIsPlaying]);

  /* Volume sync */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.currentTime)) return;
    setCurrentTime(audio.currentTime);
  }

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (muted && v > 0) setMuted(false);
  }

  function handleClosePlayer() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    setVisible(false);
    setTimeout(() => {
      clearPlayer();
      setCurrentTime(0);
      setDuration(0);
    }, 300);
  }

  if (!currentSong) return null;

  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime =
    Number.isFinite(currentTime) && currentTime >= 0 ? currentTime : 0;
  const progress =
    safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;
  const volumePct = muted ? 0 : volume * 100;

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />

      {/* ── Floating player bar ── */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-transform duration-300 ease-out
          ${visible ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div
          className="
            mx-auto max-w-5xl overflow-hidden rounded-2xl
            border border-white/10 bg-[oklch(0.13_0.04_285/0.85)]
            shadow-[0_-4px_60px_oklch(0.58_0.22_300/0.18),0_8px_40px_rgba(0,0,0,0.5)]
            backdrop-blur-2xl
          "
        >
          {/* Progress bar — full width strip at the very top */}
          <div className="relative h-[3px] w-full bg-white/8">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-chart-2 transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Clickable seek overlay */}
            <input
              type="range"
              min={0}
              max={safeDuration || 1}
              step={0.1}
              value={safeCurrentTime}
              onChange={handleSeekChange}
              className={`absolute inset-0 h-full w-full opacity-0 cursor-pointer`}
            />
          </div>

          {/* Main row */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">

            {/* ── Song info ── */}
            <div className="flex min-w-0 items-center gap-3">
              {/* Animated album art */}
              <div
                className={`
                  relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl
                  bg-gradient-to-br from-primary/40 via-accent/30 to-chart-2/30
                  ring-1 ring-primary/20
                `}
              >
                <Music2
                  className={`h-5 w-5 text-primary transition-transform duration-700 ${isPlaying ? "scale-110" : "scale-100"}`}
                />
                {/* Pulse ring when playing */}
                {isPlaying && (
                  <span className="absolute inset-0 animate-ping rounded-xl bg-primary/15" />
                )}
              </div>

              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-semibold text-white">
                  {currentSong.title}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                  <span>{formatTime(safeCurrentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(safeDuration)}</span>
                </div>
              </div>
            </div>

            {/* ── Transport controls ── */}
            <div className="flex items-center gap-1">
              <ControlBtn onClick={playPrevious} label="Previous">
                <SkipBack className="h-4 w-4" />
              </ControlBtn>

              {/* Play / Pause — prominent */}
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="
                  mx-1 flex h-10 w-10 items-center justify-center rounded-full
                  bg-primary text-primary-foreground shadow-lg shadow-primary/30
                  transition-all duration-150 hover:scale-105 hover:shadow-primary/50
                  active:scale-95
                "
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                )}
              </button>

              <ControlBtn onClick={playNext} label="Next">
                <SkipForward className="h-4 w-4" />
              </ControlBtn>
            </div>

            {/* ── Volume + close ── */}
            <div className="flex items-center justify-end gap-2">
              {/* Volume — hidden on mobile, shown md+ */}
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={() => setMuted((m) => !m)}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <div className="relative w-20">
                  <div className="h-[3px] overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full bg-white/60 transition-[width]"
                      style={{ width: `${volumePct}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={`${rangeClass} absolute inset-0 h-full w-full opacity-0`}
                  />
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                aria-label="Close player"
                onClick={handleClosePlayer}
                className="
                  flex h-8 w-8 items-center justify-center rounded-full
                  text-white/40 transition-all hover:bg-white/10 hover:text-white
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Small icon button ── */
function ControlBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="
        flex h-9 w-9 items-center justify-center rounded-full
        text-white/60 transition-all
        hover:bg-white/10 hover:text-white
        active:scale-90
      "
    >
      {children}
    </button>
  );
}