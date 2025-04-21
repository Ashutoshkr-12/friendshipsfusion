import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/hooks/profileIdContext";
import { ThemeScript } from "@/lib/theme-script";

export const metadata: Metadata = {
  title: "Friendship fusion",
  description: "A place where you really find a friend",
};

export default  function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript/>
      </head>
      <body>
           <ThemeProvider>
            <UserProvider>
        {children}
        <Toaster position="top-center" className="bg-zinc-900"/>
        </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
