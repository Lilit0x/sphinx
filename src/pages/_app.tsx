import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Head from "next/head"

import { ApplicationContainer } from "@/app/components/ApplicationContainer"

function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          loader: "bars",
        }}
      >
        <Notifications position="top-center" zIndex={2077} />
        <ModalsProvider>
          <ApplicationContainer>
            <props.Component {...props.pageProps} />
          </ApplicationContainer>
        </ModalsProvider>
      </MantineProvider>
    </>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
