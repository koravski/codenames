import React from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Meta = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Head>
      <title>{t("page-title", "Codenames - Play Online")}</title>
      <meta name="description" content={t("page-description")} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <link rel="shortcut icon" href="/icon.png" />
      <meta property="og:title" content="codenames.koravski.com" />
      <meta property="og:description" content={t("page-description")} />
      <meta
        property="og:image"
        content="https://codenames.koravski.com/og-image.png"
      />
      <meta property="og:url" content="https://codenames.koravski.com" />
      <meta name="twitter:title" content="codenames" />
      <meta name="twitter:description" content={t("page-description")} />
      <meta
        name="twitter:image"
        content="https://codenames.koravski.com/og-image.png"
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="theme-color" content="#f7fafc"></meta>
      <link
        href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap"
        rel="stylesheet"
      ></link>
      <link rel="apple-touch-icon" href="/icon.png"></link>
      <link rel="manifest" href="/manifest.webmanifest"></link>
    </Head>
  );
};

export default Meta;
