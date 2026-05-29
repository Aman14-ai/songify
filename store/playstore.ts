import { create } from "zustand";

export type PlayerSong = {
  _id: string;
  title: string;
  audioUrl: string;
  duration: number;
  playCount?: number;
  createdAt?: string;
};

type PlayerState = {
  currentSong: PlayerSong | null;
  queue: PlayerSong[];
  currentIndex: number;
  isPlaying: boolean;

  playSong: (song: PlayerSong, songs?: PlayerSong[]) => void;
  setIsPlaying: (value: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,

  playSong: (song, songs = []) => {
    const finalQueue = songs.length > 0 ? songs : [song];

    const index = finalQueue.findIndex((item) => item._id === song._id);

    set({
      currentSong: song,
      queue: finalQueue,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
    });
  },

  setIsPlaying: (value) => {
    set({ isPlaying: value });
  },

  playNext: () => {
    const { queue, currentIndex } = get();

    if (queue.length === 0) return;

    const nextIndex = currentIndex + 1 >= queue.length ? 0 : currentIndex + 1;

    set({
      currentSong: queue[nextIndex],
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();

    if (queue.length === 0) return;

    const previousIndex =
      currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;

    set({
      currentSong: queue[previousIndex],
      currentIndex: previousIndex,
      isPlaying: true,
    });
  },

  clearPlayer: () => {
    set({
      currentSong: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
    });
  },
}));