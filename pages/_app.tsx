/* eslint-disable */

import { AppProps } from "next/app";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";

const httpLink = new HttpLink({
  uri: "api/graphql",
  credentials: "same-origin",
});

const getWsUrl = () => {
  const url = new URL("/api/graphql", window.location.href);
  url.protocol = url.protocol.replace("http", "ws");
  return url.href;
};

const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      new WebSocketLink({
        uri: getWsUrl(),
        options: {
          reconnect: true,
        },
      }),
      httpLink
    )
  : httpLink;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
