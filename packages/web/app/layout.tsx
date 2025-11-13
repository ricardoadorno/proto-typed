import type { Metadata } from "next";
import "./globals.css";
import { Provider } from '@/utils/providers';
import { withAssetPath } from '@/utils/base-path';

// Using system fonts instead of Google Fonts to avoid network issues during build
const geistSans = {
    variable: "--font-geist-sans",
};

const geistMono = {
    variable: "--font-geist-mono",
};

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
