import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header/page';

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
      <body className="min-h-screen font-sans antialiased grainy">
        
        <header>
        
          
            <Header />
            
          
          <div>
           
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <Home />
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
