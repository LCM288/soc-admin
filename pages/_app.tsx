import "react-toastify/dist/ReactToastify.css";
import "bulma/bulma.sass";
import "styles/select-fix.css";
import "styles/toast-fix.css";
import "styles/markdown-edit.css";
import "styles/modal-overflowing.css";
import "react-day-picker/lib/style.css";
import "easymde/dist/easymde.min.css";
import { DateTime } from "luxon";
import { AppProps } from "next/app";
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { ToastContainer } from "react-toastify";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client";
import SetLogoutTime from "components/setLogoutTime";

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
  add: () => {},
  remove: () => {},
});

export const TimerContext = React.createContext<{
  get: () => DateTime;
  set: Dispatch<SetStateAction<DateTime>>;
}>({ get: () => DateTime.invalid("Not initialized"), set: () => {} });

function App({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout =
    ((Component as unknown) as {
      Layout: React.ComponentType;
    }).Layout ?? React.Fragment;

  const clipCount = useRef(0);

  const addClipCount = useCallback(() => {
    if (clipCount.current === 0) {
      document.scrollingElement?.classList.add("is-clipped");
    }
    clipCount.current += 1;
  }, []);

  const removeClipCount = useCallback(() => {
    clipCount.current -= 1;
    if (clipCount.current === 0) {
      document.scrollingElement?.classList.remove("is-clipped");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = "en";
  });

  const [timer, setTimer] = useState(DateTime.invalid("Not initialized"));

  return (
    <>
      <ApolloProvider client={client}>
        <ClipCountContext.Provider
          value={{
            add: addClipCount,
            remove: removeClipCount,
          }}
        >
          <TimerContext.Provider value={{ get: () => timer, set: setTimer }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <SetLogoutTime {...pageProps} />
          </TimerContext.Provider>
        </ClipCountContext.Provider>
      </ApolloProvider>
      <ToastContainer closeButton={BulmaCloseBtn} />
    </>
  );
}

export default App;
