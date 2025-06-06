import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karavali Agro Service",
  description: "Your e-commerce store for agricultural products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
