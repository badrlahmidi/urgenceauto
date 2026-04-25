import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });
// Assuming an Arabic font would be imported here, e.g., Noto Sans Arabic or Tajawal
// import { Tajawal } from "next/font/google";
// const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      template: '%s | Urgence Auto',
      default: t('title'),
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://urgenceauto.ma',
      siteName: 'Urgence Auto',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_FR',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Apply the appropriate font class based on the locale
  const fontClass = locale === 'ar' ? 'font-arabic' : inter.className; // using font-arabic utility class to be defined in tailwind

  return (
    <html lang={locale} dir={dir}>
      <body className={fontClass}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
