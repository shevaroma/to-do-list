import { Toaster } from "sonner";
import "./globals.css";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      {children}
      <Toaster richColors />
    </body>
  </html>
);

export default RootLayout;
