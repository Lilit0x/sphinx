import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ApplicationContainer } from '@/app/components/ApplicationContainer';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import dynamic from 'next/dynamic';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          loader: 'bars'
        }}
      >
        <Notifications position="top-center" zIndex={2077} />
        <ModalsProvider>
          <ApplicationContainer>
            <Component {...pageProps} />
          </ApplicationContainer>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});