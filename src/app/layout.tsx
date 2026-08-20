import type { Metadata } from "next"
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google"
import { PageTransition } from "@/components/common/page-transition"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const sourceSerif4 = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Iridel Demo Template",
  description:
    "Iridel — build polished, client-ready demos with a warm, minimal, accessibility-first design system.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif4.variable} antialiased`}
      >
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
