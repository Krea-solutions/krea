import HomeClient from '@/components/HomeClient';
import { getLocale, getMessages } from 'next-intl/server';

export default async function Home() {
  const locale = await getLocale();
  const messages = await getMessages();
  return <HomeClient locale={locale} messages={messages as any} />;
}
