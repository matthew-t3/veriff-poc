"use client";
import { createVeriffFrame } from "@veriff/incontext-sdk";
import { useEffect, useState } from "react";

export function Verif() {
  const [sessionURL, setSessionURL] = useState("");

  async function getSession() {
    const response = await fetch("/api/session");

    if (!response.ok) {
      const error = await response.json();
      console.log("error", error);
      alert("Something went wrong");
    }

    const data = await response.json();
    if (!data.verification.sessionToken) {
      alert("Something went wrong with the response");
      return;
    }

    setSessionURL(data.verification.url);
  }

  useEffect(() => {
    if (!sessionURL) {
      return;
    }

    const veriffFrame = createVeriffFrame({
      url: sessionURL,
      embedded: true,
      embeddedOptions: {
        rootElementID: "veriff-container",
      },
      onEvent: (event) => {
        console.log("event", event);
      },
    });
  }, [sessionURL]);

  return (
    <div className="flex h-svh w-full flex-col">
      <button onClick={getSession}>Get Session</button>
      <div id="veriff-container" className="w-full h-full"></div>
    </div>
  );
}
