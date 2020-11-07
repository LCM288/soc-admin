/* eslint-disable react/jsx-props-no-spreading */
import "react-toastify/dist/ReactToastify.css";
import "bulma/bulma.sass";
import "styles/select-fix.css";
import "styles/toast-fix.css";
import "styles/markdown-edit.css";
import "styles/modal-overflowing.css";
import "styles/react-select-label.scss";
import "react-day-picker/lib/style.css";
import "easymde/dist/easymde.min.css";
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

export const ClipCountContext = React.createContext({
  count: 0,
  add: () => {},
  remove: () => {},
});

function App({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout =
    ((Component as unknown) as {
      Layout: React.ComponentType;
    }).Layout ?? React.Fragment;
  const [clipCount, setClipCount] = React.useState(0);
  const addClipCount = React.useCallback(() => {
    setClipCount(clipCount + 1);
  }, [clipCount]);
  const removeClipCount = React.useCallback(() => {
    setClipCount(clipCount - 1);
  }, [clipCount]);
  return (
    <>
      <ApolloProvider client={client}>
        <ClipCountContext.Provider
          value={{
            count: clipCount,
            add: addClipCount,
            remove: removeClipCount,
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ClipCountContext.Provider>
      </ApolloProvider>
      <ToastContainer closeButton={BulmaCloseBtn} />
    </>
  );
}

export default App;
