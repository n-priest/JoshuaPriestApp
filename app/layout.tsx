import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Joshua Priest — Dashboard",
  description: "Private dashboard for Joshua Priest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
