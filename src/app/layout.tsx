import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header/page';

import Home from './page';
import Dashboard from './dashboard/page';
import Navbar from '../components/Header/page';

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

    <html lang="en">
      <ClerkProvider>
        <body className="min-h-screen font-sans antialiased grainy">

          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
          <Dashboard />
          
            <UserButton />
          </SignedIn>
          <header>
           

            <Header />


            <div>


            </div>
          </header>
          <Home />
          {children}

        </body>
      </ClerkProvider>
    </html>

  );
}
