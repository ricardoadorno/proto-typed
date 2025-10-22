import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from '@proto-typed/shared/providers';
import { withAssetPath } from '@proto-typed/shared/base-path';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "proto-typed",
    description: "Create and share prototypes with ease.",
    icons: {
        icon: withAssetPath("/logo.svg"),
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <Provider>
                    {children}
                </Provider>
            </body>
        </html>
    );
}
