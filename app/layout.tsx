import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KeyCoachAI — AI-Powered Typing Coach",
  description: "Analyze your typing, identify weak spots, and get AI-generated personalized exercises to type faster and more accurately.",
  keywords: ["typing", "typing test", "AI coach", "typing practice", "WPM", "keyboard"],
  authors: [{ name: "Maghfoor Ahmad" }],
  openGraph: {
    title: "KeyCoachAI — AI-Powered Typing Coach",
    description: "Type faster with AI-generated personalized exercises.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
