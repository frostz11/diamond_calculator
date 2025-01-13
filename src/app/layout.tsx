import { GeistSans, GeistMono } from 'geist/font';
// Or if you want Google fonts:
import { Roboto_Mono } from 'next/font/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${GeistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}