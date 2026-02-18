import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Exchange skills, learn together.",
};

export default function RootLayout(
  {children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
