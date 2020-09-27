/* eslint-disable react/jsx-props-no-spreading */
import "bulma/bulma.sass";
import "styles/select-fix.css";
import { AppProps } from "next/app";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

function App({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout =
    ((Component as unknown) as {
      Layout: React.ComponentType<Record<string, unknown>>;
    }).Layout ?? React.Fragment;
  return (
    <Layout time={Math.floor(new Date().valueOf() / 1000) + 1801}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Layout>
  );
}

export default App;
