import { GeistSans, GeistMono } from 'geist/font';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${GeistSans.className} antialiased`}>
        <main>
          {children}
        </main>
        {/* For monospace text */}
        <code className={GeistMono.className}>
          // your code here
        </code>
      </body>
    </html>
  );
}