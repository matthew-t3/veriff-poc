"use client";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { useEffect, useState } from "react";

export function Verif() {
  const [sessionURL, setSessionURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(true);

  async function getSession() {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  useEffect(() => {
    if (!sessionURL) {
      return;
    }

    createVeriffFrame({
      url: sessionURL,
      embedded: true,
      embeddedOptions: {
        rootElementID: "veriff-container",
      },
      onEvent: (event) => {
        console.log("event", event);
        if ([MESSAGES.CANCELED, MESSAGES.RELOAD_REQUEST].includes(event)) {
          setSessionURL("");
        }

        if (event === MESSAGES.FINISHED) {
          setIsFinished(true);
        }
      },
      onReload: () => {
        setSessionURL("");
      },
    });
  }, [sessionURL]);

  if (!isFinished) {
    return (
      <div className="flex h-svh w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Verification finished</h1>
      </div>
    );
  }

  return (
    <div className="flex h-svh w-full flex-col">
      {!sessionURL && (
        <button
          onClick={getSession}
          className="bg-blue-200 p-2 rounded-md w-fit mx-auto cursor-pointer disabled:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Session"}
        </button>
      )}
      <div
        id="veriff-container"
        className="w-full h-full text-center justify-center flex items-center"
      >
        {!sessionURL && "Veriff will be loaded here"}
      </div>
    </div>
  );
}
