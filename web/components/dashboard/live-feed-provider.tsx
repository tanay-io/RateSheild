"use client";

import { createContext, useContext } from "react";
import { useLiveFeed, type LiveFeedState } from "@/hooks/use-live-feed";

const LiveFeedContext = createContext<LiveFeedState | null>(null);

export function LiveFeedProvider({ children }: { children: React.ReactNode }) {
  const feed = useLiveFeed();
  return <LiveFeedContext.Provider value={feed}>{children}</LiveFeedContext.Provider>;
}

export function useLiveFeedContext() {
  const feed = useContext(LiveFeedContext);
  if (!feed) throw new Error("useLiveFeedContext must be used inside LiveFeedProvider");
  return feed;
}
