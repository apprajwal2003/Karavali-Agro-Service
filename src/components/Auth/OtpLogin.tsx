"use client";

import { useState, useRef, useEffect, useTransition, FormEvent } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase"; // Adjust this import path as necessary

interface OtpInputProps {
  onSignInSuccess?: () => void;
}

export default function OtpInput({ onSignInSuccess }: OtpInputProps) {
  const OTP_LENGTH = 6;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCountDown, setResendCountDown] = useState(0);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isSendingOtp, startOtpSendTransition] = useTransition();
  const [isVerifyingOtp, startOtpVerifyTransition] = useTransition();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountDown > 0) {
      timer = setTimeout(() => setResendCountDown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountDown]);

  // Initialize invisible reCAPTCHA
  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container", // container ID string
        { size: "invisible" }
      );
    }
  }, []);

  // Handle OTP input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // Handle keyboard navigation
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
    } else if (
      e.key === "Enter" &&
      otp.every((d) => d !== "") &&
      confirmationResult
    ) {
      verifyOtp();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputsRef.current[OTP_LENGTH - 1]?.focus();
    }
  };

  // Request OTP
  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    const phone = phoneNumber.trim();
    if (!/^\+\d{10,15}$/.test(phone)) {
      setResendCountDown(0);
      return setError(
        "Phone number must be in international format (e.g., +91XXXXXXXXXX)."
      );
    }

    startOtpSendTransition(async () => {
      const verifier = (window as any).recaptchaVerifier as RecaptchaVerifier;
      try {
        const result = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmationResult(result);
        setSuccess("OTP sent successfully! Please enter the 6-digit code.");
        setResendCountDown(60);
      } catch (err: any) {
        setResendCountDown(0);
        if (err?.code === "auth/invalid-phone-number") {
          setError("Invalid phone number format or unsupported region.");
        } else if (err?.code === "auth/missing-phone-number") {
          setError("Phone number is required.");
        } else if (err?.code === "auth/too-many-requests") {
          setError(
            "Too many OTP requests from this device. Please try again later."
          );
        } else if (err?.code === "auth/captcha-check-failed") {
          setError(
            "Security check failed. Please ensure your browser is not blocking reCAPTCHA."
          );
        } else {
          setError(
            "Failed to send OTP. Please check your number and try again."
          );
        }
      }
    });
  };

  // Verify OTP
  const verifyOtp = async () => {
    setError(null);
    setSuccess(null);

    const fullOtp = otp.join("");
    if (fullOtp.length !== OTP_LENGTH) {
      return setError("Please enter the complete 6-digit OTP.");
    }

    if (!confirmationResult) {
      return setError("No OTP request initiated. Please request OTP first.");
    }

    startOtpVerifyTransition(async () => {
      try {
        await confirmationResult.confirm(fullOtp);
        setSuccess("Successfully signed in!");
        onSignInSuccess?.();
      } catch (err: any) {
        if (err?.code === "auth/invalid-verification-code") {
          setError("Invalid OTP. Please double-check the code and try again.");
          setOtp(Array(OTP_LENGTH).fill(""));
          inputsRef.current[0]?.focus();
        } else if (err?.code === "auth/code-expired") {
          setError("OTP expired. Please request a new one.");
        } else if (err?.code === "auth/user-disabled") {
          setError("This account has been disabled.");
        } else {
          setError("Failed to verify OTP. Please try again.");
        }
      }
    });
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

      {/* Phone Number Input */}
      {!confirmationResult && (
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
            disabled={!phoneNumber || isSendingOtp || resendCountDown > 0}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSendingOtp
              ? "Sending OTP..."
              : resendCountDown > 0
              ? `Resend in ${resendCountDown}s`
              : "Send OTP"}
          </button>
        </form>
      )}

      {/* OTP Input Fields */}
      {confirmationResult && (
        <>
          <p className="text-gray-700 text-sm mb-4">
            A 6-digit code has been sent to{" "}
            <span className="font-semibold">{phoneNumber}</span>.
          </p>
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
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            ))}
          </div>

          <button
            onClick={verifyOtp}
            disabled={!isOtpComplete || isVerifyingOtp}
            className="mt-6 w-full bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => requestOtp()} // <-- fixed: no event passed here
            disabled={isSendingOtp || resendCountDown > 0}
            className="mt-3 w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-md font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSendingOtp
              ? "Sending OTP..."
              : resendCountDown > 0
              ? `Resend in ${resendCountDown}s`
              : "Resend OTP"}
          </button>
        </>
      )}
      {/* Error and Success Messages */}
      {error && (
        <p className="text-red-600 text-sm mt-4">
          <strong>Error:</strong> {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm mt-4">
          <strong>Success:</strong> {success}
        </p>
      )}
    </div>
  );
}
