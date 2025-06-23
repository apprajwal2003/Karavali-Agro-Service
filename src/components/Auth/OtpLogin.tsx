"use client";

import { useState, useRef, useEffect, useTransition, FormEvent } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase";

interface OtpInputProps {
  onSubmit?: (otp: string) => void;
}

export default function OtpInput({ onSubmit }: OtpInputProps) {
  const length = 6;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountDown, setResendCountDown] = useState(0);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountDown > 0) {
      timer = setTimeout(() => setResendCountDown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountDown]);

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      verifier.render();
      (window as any).recaptchaVerifier = verifier;
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);

    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      onSubmit?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && otp[idx] === "") {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft") {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (pasted.length === length) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputsRef.current[length - 1]?.focus();
      onSubmit?.(newOtp.join(""));
    }
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountDown(60);
    setError(null);
    setSuccess("");

    const phone = phoneNumber.trim();
    if (!/^\+\d{10,15}$/.test(phone)) {
      setResendCountDown(0);
      return setError(
        "Phone number must be in international format like +91XXXXXXXXXX"
      );
    }

    startTransition(async () => {
      const verifier = (window as any).recaptchaVerifier as RecaptchaVerifier;

      try {
        const result = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmationResult(result);
        setSuccess("OTP sent successfully!");
      } catch (err: any) {
        setResendCountDown(0);
        if (err?.code === "auth/invalid-phone-number") {
          setError("Invalid phone number.");
        } else if (err?.code === "auth/missing-phone-number") {
          setError("Phone number is required.");
        } else if (err?.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  return (
    <>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (e.g. +91XXXXXXXXXX)"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </form>
      )}

      <div className="flex justify-center space-x-2" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        ))}
      </div>

      <button
        disabled={!phoneNumber || isPending || resendCountDown > 0}
        onClick={() => requestOtp()}
        className="mt-5 border border-blue-500 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resendCountDown > 0
          ? `Resend OTP in ${resendCountDown}s`
          : isPending
          ? "Sending..."
          : "Send OTP"}
      </button>

      <div className="p-10 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container" />
      {isPending && (
        <div className="mt-4 flex justify-center">
          <svg
            fill="hsl(228, 97%, 42%)"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 animate-spin"
          >
            <path d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.6s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      )}
    </>
  );
}
