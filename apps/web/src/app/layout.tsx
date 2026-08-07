import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyramid - Task Management",
  description: "Track and organize your projects and tasks in real-time.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("pyramid-theme")?.value ?? "light";
  const color = cookieStore.get("pyramid-color")?.value ?? "blue";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} data-color={color}>
      <body className="bg-bg text-fg min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
