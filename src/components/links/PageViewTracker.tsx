"use client";

import { useEffect } from "react";
import { logUserBehavior } from "@/lib/firebaseClient";

export default function PageViewTracker({ pageName }: { pageName: string }) {
  useEffect(() => {
    logUserBehavior("page_view", {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, [pageName]);

  return null;
}
