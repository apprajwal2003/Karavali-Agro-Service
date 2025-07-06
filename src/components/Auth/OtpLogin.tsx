"use client";

import { useState, useEffect, useTransition, FormEvent } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase";

declare global {
  interface Window {
    recaptchaVerifier?: import("firebase/auth").RecaptchaVerifier;
  }
}

export default function OtpInput() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountDown, setResendCountDown] = useState(0);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [isPending, startTransition] = useTransition();

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountDown > 0) {
      timer = setTimeout(() => setResendCountDown(resendCountDown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountDown]);

  // Correct Recaptcha setup
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          console.log("Recaptcha resolved:", response);
        },
        "expired-callback": () => {
          console.log("Recaptcha expired");
        },
      });
      verifier.render();
      window.recaptchaVerifier = verifier;
      setRecaptchaVerifier(verifier);
    }
  }, []);

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountDown(10);
    setError("");

    startTransition(async () => {
      try {
        if (!recaptchaVerifier) {
          return setError("Recaptcha not initialized");
        }

        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmation);
        setSuccess("OTP sent successfully!");
      } catch (err: any) {
        console.error("Error sending OTP:", err);
        setResendCountDown(0);

        if (err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number format.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
      <div id="recaptcha-container" />

      {!confirmationResult && (
        <div>
          <form onSubmit={requestOtp} className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Enter Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +919876543210"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={!phoneNumber || isPending || resendCountDown > 0}
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              {resendCountDown > 0
                ? `Resend OTP in ${resendCountDown}s`
                : isPending
                ? "Sending..."
                : "Send OTP"}
            </button>
          </form>
        </div>
      )}

      <div className="mt-6">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>

      {isPending && <div className="mt-4 text-blue-500">Processing...</div>}
    </div>
  );
}
