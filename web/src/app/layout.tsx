import QueryProvider from "./QueryProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
