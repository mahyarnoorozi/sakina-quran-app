"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/player";
import { PlayerShell, type TabId } from "@/components/sakina/PlayerShell";
import { HomePage } from "@/components/sakina/HomePage";
import { QuranPage, SurahDetailPage } from "@/components/sakina/QuranPage";
import { MixerPage } from "@/components/sakina/MixerPage";
import { LibraryPage } from "@/components/sakina/LibraryPage";
import { ProfilePage } from "@/components/sakina/ProfilePage";
import { Onboarding } from "@/components/sakina/Onboarding";
import { MixerSheet } from "@/components/sakina/MixerSheet";
import { SearchDialog } from "@/components/sakina/SearchDialog";
import { PlayerPage } from "@/components/sakina/PlayerPage";
import { SleepModePage } from "@/components/sakina/SleepModePage";

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [openSurahId, setOpenSurahId] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [sleepModeOpen, setSleepModeOpen] = useState(false);

  const { hasOnboarded, mixerOpen, setMixerOpen, currentSurahId } = usePlayerStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary text-2xl font-bold">سَکینه</div>
      </div>
    );
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={() => {}} />;
  }

  const handleTabChange = (t: TabId) => {
    setActiveTab(t);
    setOpenSurahId(null);
    setPlayerOpen(false);
    setSleepModeOpen(false);
  };

  const handleOpenSurah = (id: number) => {
    setOpenSurahId(id);
    setPlayerOpen(false);
    setSleepModeOpen(false);
  };

  const handleBackFromSurah = () => {
    setOpenSurahId(null);
  };

  const handleOpenPlayer = () => {
    if (currentSurahId) {
      setPlayerOpen(true);
    }
  };

  const handleOpenSleepMode = () => {
    setSleepModeOpen(true);
  };

  return (
    <>
      <PlayerShell activeTab={activeTab} onTabChange={handleTabChange} onOpenPlayer={handleOpenPlayer}>
        {openSurahId !== null ? (
          <SurahDetailPage surahId={openSurahId} onBack={handleBackFromSurah} />
        ) : activeTab === "home" ? (
          <HomePage
            onNavigateQuran={() => setActiveTab("quran")}
            onOpenSurah={handleOpenSurah}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenSleepMode={handleOpenSleepMode}
          />
        ) : activeTab === "quran" ? (
          <QuranPage onOpenSurah={handleOpenSurah} />
        ) : activeTab === "mixer" ? (
          <MixerPage onOpenSurah={handleOpenSurah} />
        ) : activeTab === "library" ? (
          <LibraryPage onOpenSurah={handleOpenSurah} />
        ) : activeTab === "profile" ? (
          <ProfilePage />
        ) : null}
      </PlayerShell>

      <MixerSheet open={mixerOpen} onOpenChange={setMixerOpen} />

      {playerOpen && (
        <PlayerPage onBack={() => setPlayerOpen(false)} />
      )}

      {sleepModeOpen && (
        <SleepModePage onBack={() => setSleepModeOpen(false)} />
      )}

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onOpenSurah={(id) => {
          setSearchOpen(false);
          setActiveTab("quran");
          handleOpenSurah(id);
        }}
      />
    </>
  );
}
