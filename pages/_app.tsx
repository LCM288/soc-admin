/* eslint-disable react/jsx-props-no-spreading */
import "react-toastify/dist/ReactToastify.css";
import "bulma/bulma.sass";
import "styles/select-fix.css";
import "styles/toast-fix.css";
import { AppProps } from "next/app";
import React from "react";
import { ToastContainer } from "react-toastify";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client";

const BulmaCloseBtn = ({
  closeToast,
}: {
  closeToast: () => void;
}): React.ReactElement => (
  // eslint-disable-next-line jsx-a11y/control-has-associated-label, react/button-has-type
  <button onClick={closeToast} className="delete" />
);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

function App({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout =
    ((Component as unknown) as {
      Layout: React.ComponentType;
    }).Layout ?? React.Fragment;
  return (
    <Layout>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
      <ToastContainer closeButton={BulmaCloseBtn} />
    </Layout>
  );
}

export default App;
