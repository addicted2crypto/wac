import { ClerkProvider, SignedOut, SignInButton } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Landing } from './Landing';
import Home from './page';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "William's Appliance Repair Consult- WAC",
  description: "Appliance consultation quickly before paying for a service call",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        
        <header>
        
          <div>
            Login Header
          </div>
          <div>
            <Landing />
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </header>
        <Home />
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
