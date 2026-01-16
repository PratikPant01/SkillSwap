import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

export const metadata: Metadata = {
  title: "SkillSwap",
  description: "Exchange skills, learn together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

