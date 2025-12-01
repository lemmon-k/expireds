import "./globals.css";
import { Providers } from "@/providers";

const title = process.env.NEXT_PUBLIC_BRAND;
const description = `${process.env.NEXT_PUBLIC_BRAND} | Real-time expired listings for real estate agents`;
const url = process.env.NEXT_PUBLIC_BASE_URL;
const icon = `${url}/assets/x-192.png`; // TODO

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
};

export const metadata = {
  title: title,
  description: description,
  keywords: "",
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    images: [
      {
        url: icon,
        width: 192,
        height: 192,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [icon],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="fade-in">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
