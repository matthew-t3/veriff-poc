"use client";
import { useEffect, useRef, useState } from "react";

export function HomePage() {
  const hasTriggered = useRef(false);
  const [sessionURL, setSessionURL] = useState("");
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    function getSession() {
      if (hasTriggered.current && sessionURL) {
        return;
      }

      hasTriggered.current = true;

      setIsLoading(true);
      fetch("/api/session")
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          setSessionURL(data.verification.url);
          setIsLoading(false);
          hasTriggered.current = false;
        });
    }

    getSession();
  }, [sessionURL]);

  useEffect(() => {
    if (!sessionURL) {
      return;
    }

    window.location.href = sessionURL;
  }, [sessionURL]);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      <p>Loading ...</p>
    </div>
  );
}
