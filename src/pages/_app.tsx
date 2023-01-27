import { ConfigProvider } from "antd";
// import {getSession, SessionProvider} from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TAppPropsWithLayout } from "~/types/layout";
// toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "~/store";

// change locale to vietnamese
import locale from "antd/lib/locale/vi_VN";
import "moment/locale/en-in";

// add styles and icons
import "antd/dist/antd.less";
import "nprogress/nprogress.css";
import "tippy.js/dist/tippy.css";
import "~/assets/css/main.scss";
import "../../styles/globals.css";
import "../../styles/styles.css";
import "../assets/fontawesome/css/all.min.css";
// signalR
import BlankLayout from "~/components/globals/layout/blankLayouts";

// config
const queryClient = new QueryClient();

NProgress.configure({ showSpinner: false });

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: TAppPropsWithLayout) => {
  const [loading, setLoading] = useState(false);
  // const getLayout = Component.getLayout || ((page) => page);
  const Layout = Component.Layout || BlankLayout;
  const breadcrumb = Component.breadcrumb;

  // React.useEffect(() => {
  // 	if (localStorage.getItem("token") && localStorage.getItem("currentUser")) {
  // 		const handleRouteStart = () => {
  // 			setLoading(true);
  // 			NProgress.start();
  // 		};
  // 		const handleRouteDone = () => {
  // 			setLoading(false);
  // 			NProgress.done();
  // 		};

  // 		Router.events.on("routeChangeStart", handleRouteStart);
  // 		Router.events.on("routeChangeComplete", handleRouteDone);
  // 		Router.events.on("routeChangeError", handleRouteDone);

  // 		return () => {
  // 			// Make sure to remove the event handler on unmount!
  // 			Router.events.off("routeChangeStart", handleRouteStart);
  // 			Router.events.off("routeChangeComplete", handleRouteDone);
  // 			Router.events.off("routeChangeError", handleRouteDone);
  // 		};
  // 	}
  // }, []);

  return (
    // <SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={locale}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Head>
              <link rel="icon" type="image/png" href="/logo.png" />
              <title>
                {!loading ? Component?.displayName : "Đang chuyển hướng..."}
              </title>
            </Head>
            <Layout breadcrumb={breadcrumb}>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </QueryClientProvider>
    // </SessionProvider>
  );
};

export default MyApp;
