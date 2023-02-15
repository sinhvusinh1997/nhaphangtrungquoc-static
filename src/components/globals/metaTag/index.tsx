import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const MetaTags = ({ data }) => {
  return (
    <Head>
      <link rel="canonical" href={window.location.href} />
      <meta name="application-name" content={data?.ApplicationName} />
      <script async src={data?.GoogleAnalytics}></script>
      {/* <meta name="google-analytics" content={data?.GoogleAnalytics} /> */}
      <meta
        name="google-site-verification"
        content={data?.GoogleSiteVerification}
      />
      <meta name="keywords" content={data?.MetaKeyword} />
      <meta name="og:email" content={data?.EmailContact} />
      <meta name="og:phone_number" content={data?.Hotline} />
      <meta name="og:title" content={data?.OGTitle} />
      <meta name="reply-to" content={data?.EmailContact} />
      <meta name="robots" content="index,follow" />
      <meta name="description" content={data?.MetaDescription} />
      <meta property="og:locale" content={data?.OGLocale} />
      <meta property="og:site_name" content={data?.OGSiteName} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:description" content={data?.OGDescription} />
    </Head>
  );
};

export default MetaTags;
