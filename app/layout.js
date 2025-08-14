import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthCheck } from "@/components/AuthCheck";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinLense - Smart Finance Vision",
  description: "Democratize personal finance management through AI-powered insights and intelligent budgeting",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthCheck />
        <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster/>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}