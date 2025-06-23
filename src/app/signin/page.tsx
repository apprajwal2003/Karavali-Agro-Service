"use client";
import { OtpInput } from "@/components";

export default function OtpPage() {
  const handleOtpSubmit = (otp: string) => {
    console.log("OTP Submitted:", otp);
    // Call your backend verification here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Enter OTP</h1>
      <OtpInput onSubmit={handleOtpSubmit} />
    </div>
  );
}
