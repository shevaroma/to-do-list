import { Toaster } from "sonner";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
