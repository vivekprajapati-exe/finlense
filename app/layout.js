import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinLense - Smart Finance Vision",
  description: "Democratize personal finance management through AI-powered insights and intelligent budgeting",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            className = "text-white"
          >
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Toaster 
                position="top-center" 
                toastOptions={{
                  style: {
                    fontSize: '14px'
                  }
                }}
              />
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}