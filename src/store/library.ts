"use client";

/**
 * استور کتابخانه سکینه v5 — علاقه‌مندی، پلی‌لیست، دانلود، تاریخچه
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FavoriteItem {
  surahId: number;
  ayah?: number;
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  surahIds: number[];
  reciterId?: string;
  createdAt: number;
}

export interface DownloadItem {
  surahId: number;
  reciterId: string;
  sizeKB: number;
  downloadedAt: number;
  status: "downloading" | "done" | "error";
  progress: number; // ۰-۱۰۰
}

export interface HistoryItem {
  id: string;
  surahId: number;
  ayah: number;
  reciterId: string;
  playedAt: number;
  seconds: number;
}

interface LibraryState {
  favorites: FavoriteItem[];
  playlists: Playlist[];
  downloads: DownloadItem[];
  history: HistoryItem[];

  toggleFavorite: (surahId: number, ayah?: number) => boolean;
  isFavorite: (surahId: number, ayah?: number) => boolean;
  createPlaylist: (name: string, surahIds?: number[]) => string;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, surahId: number) => void;
  removeFromPlaylist: (id: string, surahId: number) => void;

  setDownload: (surahId: number, reciterId: string, patch: Partial<DownloadItem>) => void;
  removeDownload: (surahId: number) => void;
  isDownloaded: (surahId: number, reciterId?: string) => boolean;

  logPlay: (surahId: number, ayah: number, reciterId: string, seconds: number) => void;

  clearHistory: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      playlists: [],
      downloads: [],
      history: [],

      toggleFavorite: (surahId, ayah) => {
        const exists = get().favorites.some(
          (f) => f.surahId === surahId && f.ayah === ayah
        );
        set((s) => ({
          favorites: exists
            ? s.favorites.filter((f) => !(f.surahId === surahId && f.ayah === ayah))
            : [{ surahId, ayah, addedAt: Date.now() }, ...s.favorites].slice(0, 500),
        }));
        return !exists;
      },

      isFavorite: (surahId, ayah) =>
        get().favorites.some((f) => f.surahId === surahId && f.ayah === ayah),

      createPlaylist: (name, surahIds = []) => {
        const id = uid();
        set((s) => ({
          playlists: [
            ...s.playlists,
            { id, name, surahIds, createdAt: Date.now() },
          ],
        }));
        return id;
      },

      deletePlaylist: (id) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),

      addToPlaylist: (id, surahId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id && !p.surahIds.includes(surahId)
              ? { ...p, surahIds: [...p.surahIds, surahId] }
              : p
          ),
        })),

      removeFromPlaylist: (id, surahId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id
              ? { ...p, surahIds: p.surahIds.filter((x) => x !== surahId) }
              : p
          ),
        })),

      setDownload: (surahId, reciterId, patch) =>
        set((s) => {
          const idx = s.downloads.findIndex((d) => d.surahId === surahId);
          if (idx === -1) {
            return {
              downloads: [
                {
                  surahId,
                  reciterId,
                  sizeKB: 0,
                  downloadedAt: Date.now(),
                  status: "downloading" as const,
                  progress: 0,
                  ...patch,
                },
                ...s.downloads,
              ],
            };
          }
          const next = [...s.downloads];
          next[idx] = { ...next[idx], ...patch };
          return { downloads: next };
        }),

      removeDownload: (surahId) =>
        set((s) => ({ downloads: s.downloads.filter((d) => d.surahId !== surahId) })),

      isDownloaded: (surahId, reciterId) =>
        get().downloads.some(
          (d) => d.surahId === surahId && d.status === "done" && (!reciterId || d.reciterId === reciterId)
        ),

      logPlay: (surahId, ayah, reciterId, seconds) =>
        set((s) => {
          const last = s.history[0];
          // اگر همان سوره در ۲ دقیقه اخیر پخش شده، فقط به‌روزرسانی کن
          if (
            last &&
            last.surahId === surahId &&
            Date.now() - last.playedAt < 120_000
          ) {
            return {
              history: [
                { ...last, ayah, seconds: last.seconds + seconds, playedAt: Date.now() },
                ...s.history.slice(1),
              ],
            };
          }
          return {
            history: [
              { id: uid(), surahId, ayah, reciterId, playedAt: Date.now(), seconds },
              ...s.history,
            ].slice(0, 200),
          };
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "sakina-library-v5",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
