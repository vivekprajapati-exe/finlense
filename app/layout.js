import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(0 0% 9%)",
          colorBackground: "hsl(0 0% 100%)",
          colorInputBackground: "hsl(0 0% 100%)",
          colorInputText: "hsl(0 0% 3.9%)",
        },
        elements: {
          formButtonPrimary: 
            "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "bg-background",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
        },
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