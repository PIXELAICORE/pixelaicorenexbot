import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIXEL AICORE & NEXBOT | Creative Technology & AI Engineering Agency",
  description: "PIXEL AICORE & NEXBOT delivers world-class AI-powered automations, high-performance web development, mobile applications, and zero-trust Firestore databases worldwide.",
  keywords: ["AI Agency", "Artificial Intelligence", "Web Development", "Next.js", "Framer Motion", "Firebase Security Rules", "PayPal integrations", "Amazon KDP layouts"],
  authors: [{ name: "Pixel AICore" }],
  openGraph: {
    title: "PIXEL AICORE & NEXBOT | Where Creativity Meets Artificial Intelligence",
    description: "Deliver fluid user journeys and intelligent digital solutions. Premium systems design guidelines scaled for international enterprises.",
    type: "website",
    url: "https://pixel-aicore.agency/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "PIXEL AICORE & NEXBOT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PIXEL AICORE & NEXBOT Strategy Node",
    description: "Get custom multi-agent cognitive engineering, next-gen systems, and PayPal secured gateway assets instantly.",
    images: ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#050816] text-white antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
