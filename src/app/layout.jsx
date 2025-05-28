import { Header } from "@/components/layout/Header";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import localFont from 'next/font/local';
import { fetchFooterData, fetchHeaderData, fetchHomePageDetails, fetchInstagramFeed, fetchMarketsData, fetchTentsData } from "@/services";
import InstagramFeed from "@/components/common/InstagramFeed";
import Loader from "@/components/common/Loader";
import LoaderProvider from "@/components/common/providers/LoaderProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalsWrapper } from "@/components/common/Modals/ModalsWrapper";

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
  robots: "noindex,nofollow",
};

export default async function RootLayout({ children }) {

  const [
    headerData,
    marketsData,
    tentsData,
    footerData,
    instagramFeed,
    homePageDetails
  ] = await Promise.all([
    fetchHeaderData(),
    fetchMarketsData(),
    fetchTentsData(),
    fetchFooterData(),
    fetchInstagramFeed(),
    fetchHomePageDetails()
  ]);

  return (
    <html lang="en" className={`${neueHaasDisplayRegular.variable} ${neueHaasDisplayLight.variable} ${neueHaasDisplayMedium.variable} ${neueHaasDisplayBold.variable} ${recklessNeueRegular.variable} ${recklessNeueBold.variable} ${recklessNeueLight.variable} ${recklessNeueMedium.variable}`}>
      <body className={`antialiased`} >
        <Header data={headerData} marketsData={marketsData} tentsData={tentsData} />
        <main>
          <LoaderProvider>
            {children}
          </LoaderProvider>
        </main>
        <InstagramFeed data={instagramFeed} details={homePageDetails} />
        <Footer data={footerData} />
        <ModalsWrapper />
        <SpeedInsights />
        <Loader />
      </body>
    </html>
  );
}
