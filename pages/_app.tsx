/* eslint-disable react/jsx-props-no-spreading */

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
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
