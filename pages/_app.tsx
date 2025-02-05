import { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import { AppContextProvider } from '@/context/AppContextProvider';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { AuthModal } from '@/components/Modals/AuthModal';
import { ShareModal } from '@/components/Modals/ShareModal';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { AppDataContext } from '@/context/Common/CommonContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  const userDetailsUrl = `/api/user/details`;
  const { data: profileDetails, isLoading: isDetailsLoading } = useSWR(
    userDetailsUrl,
    fetcher,
    { errorRetryCount: 0 }
  );

  const commonContextData = {
    profileDetails: profileDetails,
    isProfileLoading: isDetailsLoading,
  };

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" enableSystem>
        <AppContextProvider>
          <AppDataContext.Provider value={commonContextData}>
            <Toaster />
            <AuthModal />
            <ShareModal />
            {!isDetailsLoading && <Component {...pageProps} />}
          </AppDataContext.Provider>
        </AppContextProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
