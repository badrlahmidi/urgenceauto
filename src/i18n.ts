import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['fr', 'ar'];

export default getRequestConfig(async ({locale}) => {
  if (!locale || !locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../public/locales/${locale}.json`)).default
  };
});
