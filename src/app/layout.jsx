import { Header } from "@/components/layout/Header";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import localFont from 'next/font/local';
import { fetchHeaderData, fetchMarketsData, fetchTentsData } from "@/services";

const neueHaasDisplayRegular = localFont({
  src: '../assets/fonts/neue-haas-display-regular.woff2',
  variable: '--font-neue-haas-display-regular',
});

const neueHaasDisplayLight = localFont({
  src: '../assets/fonts/neue-haas-display-light.woff2',
  variable: '--font-neue-haas-display-light',
});

const neueHaasDisplayMedium = localFont({
  src: '../assets/fonts/neue-haas-display-medium.woff2',
  variable: '--font-neue-haas-display-medium',
});

const neueHaasDisplayBold = localFont({
  src: '../assets/fonts/neue-haas-display-bold.woff2',
  variable: '--font-neue-haas-display-bold',
});

const recklessNeueRegular = localFont({
  src: '../assets/fonts/reckless-neue-regular.woff2',
  variable: '--font-reckless-neue-regular',
});

const recklessNeueBold = localFont({
  src: '../assets/fonts/reckless-neue-bold.woff2',
  variable: '--font-reckless-neue-bold',
});

const recklessNeueLight = localFont({
  src: '../assets/fonts/reckless-neue-light.woff2',
  variable: '--font-reckless-neue-light',
});

const recklessNeueMedium = localFont({
  src: '../assets/fonts/reckless-neue-medium.woff2',
  variable: '--font-reckless-neue-medium',
});

export const metadata = {
  title: "RENTALS | Hensley Event Resources",
};

export default async function RootLayout({ children }) {

  const [
    headerData,
    marketsData,
    tentsData
  ] = await Promise.all([
    fetchHeaderData(),
    fetchMarketsData(),
    fetchTentsData()
  ]);

  return (
    <html lang="en" className={`${neueHaasDisplayRegular.variable} ${neueHaasDisplayLight.variable} ${neueHaasDisplayMedium.variable} ${neueHaasDisplayBold.variable} ${recklessNeueRegular.variable} ${recklessNeueBold.variable} ${recklessNeueLight.variable} ${recklessNeueMedium.variable}`}>
      <body className={`antialiased`} >
        <Header data={headerData} marketsData={marketsData} tentsData={tentsData} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
