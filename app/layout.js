import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthCheck } from "@/components/AuthCheck";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinLense - Smart Finance Vision",
  description: "Democratize personal finance management through AI-powered insights and intelligent budgeting",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <div className="min-h-screen bg-background text-foreground">
              <AuthCheck />
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Toaster/>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}