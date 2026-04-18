import { Toaster } from "sonner";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <Providers>
        {children}
        <Toaster richColors />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
