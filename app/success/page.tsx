"use client";

import { useEffect } from "react";
import { isWebView } from "../api/utils";

export default function SuccessPage() {
  const isInWebView = isWebView();

  useEffect(() => {
    if (!isInWebView) {
      return;
    }
  }, [isInWebView]);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      Success
    </div>
  );
}
