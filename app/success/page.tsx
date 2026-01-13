"use client";
import { faker } from "@faker-js/faker";
import { useEffect } from "react";

import { isPostMessageSupported, isWebView } from "../api/utils";

export default function SuccessPage() {
  const isInWebView = isWebView();
  const isSupported = isPostMessageSupported();

  useEffect(() => {
    if (!isInWebView || !isSupported) {
      return;
    }

    console.log("here?");
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "KYC_SUCCESS",
        payload: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      })
    );
  }, [isInWebView, isSupported]);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      Success
    </div>
  );
}
