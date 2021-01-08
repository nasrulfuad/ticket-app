import "../styles.min.css";
import buildClient from "../api/build-client";
import { Header } from "../components";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container pt-5">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/current-user");

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
