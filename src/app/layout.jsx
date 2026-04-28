import "./globals.css";
import {
  Geist,
  Playfair_Display,
  Instrument_Serif,
  Inter_Tight,
  Fragment_Mono,
} from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-haven-serif" });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-home-heading",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-home-body",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-home-subheading",
  display: "swap",
});

export const metadata = {
  title: "Commercia - Store & Dashboard",
  description: "Modern e-commerce and store management",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        geist.variable,
        playfair.variable,
        instrumentSerif.variable,
        interTight.variable,
        fragmentMono.variable
      )}
    >
      <body
        className={`antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
