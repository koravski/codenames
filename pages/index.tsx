import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { IGame, IGameMode, ILanguage } from "../lib/game";
import LobbyGameRow from "../components/LobbyGameRow";
import Button from "../components/Button";
import DiscordButton from "../components/DiscordButton";
import Rules from "../components/Rules";
import classnames from "classnames";
import { sortBy } from "lodash";
import { gameOverSelector } from "../lib/selectors";
import { GetStaticProps } from "next";
import FirebaseNetwork, { setupFirebase } from "../hooks/firebase";
import { useTranslation, Trans } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { i18n } from "../lib/i18n";
import Head from "next/head";
import  Header  from "../components/Header";

interface IProps {
  games: IGame[];
  locale: string;
}

const Home = ({ games, locale }: IProps) => {
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [rulesMode, setRulesMode] = useState<IGameMode>("classic");
  const { t } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale as ILanguage)
  }, []);

  return (
    <>
    <Header/>
    <div className="w-screen h-min-screen p-6 flex flex-col items-center bg-gray-100">
      <Head>
      <link rel="alternate" hrefLang="x-default" href="/" />
        {["en", "bg", "fr", "es", "ru", "ptbr"].map(locale =>
          <link rel="alternate" hrefLang={locale} key={locale} href={`/${locale}`} />
        )}
      </Head>
      <div className="absolute top-0 right-0 m-2 top--3 ">
        <LanguageSelector />
      </div>
      {/* <h1 className="h1 font-mono mt-6">Codenames</h1> */}
      {/* <p className="font-mono mb-4">
        {t("tagline", "The popular card game, online. 🕵️‍♂️")}
      </p> */}
      <div className="flex">
        <Link href="/new-game">
          <a id="create-game">
            <Button>{t("create-game", "Create game")}</Button>
          </a>
        </Link>
      </div>

      <h2 className="h2 mt-6 mb-4">{t("join-room", "Join a room")}</h2>
      <div className="grid grid-flow-row grid-cols-1 gap-2 pb-6">
        {games.length === 0 && (
          <p className="text-gray-700">
            {t(
              "no-public-room",
              "There are currently no public games. Create one and invite friends!"
            )}
          </p>
        )}
        {games.map((g) => (
          <LobbyGameRow key={g.id} game={g} />
        ))}
      </div>
      {/* <DiscordButton /> */}
      <div className="w-full max-w-2xl leading-relaxed border rounded bg-white shadow p-6 text-gray-900 mt-6 ">
        <h2 id="how-to-play" className="h2 mb-4 text-center">
          {t("how-to-play", "How to play")}
        </h2>
        <p>
          {t(
            "game-tagline",
            "Codegame is a game of guessing where teams compete to find words related to a hint-word given by another player."
          )}
        </p>
        {/* <Image
          height={665}
          width={888}
          className="p-6"
          src="/illustration.svg"
          alt="Codegame illustration"
        /> */}
        <br/>
        {!seeMore && (
          <p
            onClick={() => setSeeMore(true)}
            className="cursor-pointer underline text-blue-800 hover:text-blue-700"
          >
            {t("see-more", "See more...")}
          </p>
        )}
        {seeMore && (
          <div
            className={classnames({
              "sr-only": !seeMore,
              "not-sr-only": seeMore,
            })}
          >
            <div className="flex">
              {(["classic", "duet"] as IGameMode[]).map((mode) => (
                <button
                  key={mode}
                  className={classnames(
                    "rounded font-bold mr-2 hover:font-gray-700 p-2",
                    { "bg-gray-300": rulesMode === mode }
                  )}
                  onClick={() => setRulesMode(mode)}
                >
                  {t(mode + "-rules")}
                </button>
              ))}
            </div>
            <Rules mode={rulesMode} />
          </div>
        )}
      </div>
      {/* <div className="mt-6 text-gray-700 max-w-4xl">
        <p className="mb-2">
          <Trans i18nKey="check-our-privacy-policy">
            Check our{" "}
            <PrivacyLink>privacy policy</PrivacyLink>
          </Trans>
        </p>
      </div> */}
    </div>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IProps> = async ({ locale }) => {
  const firebase = new FirebaseNetwork(setupFirebase());
  let games = await firebase.getPublicGames();

  games = games.filter(
    (g) =>
      Object.values(g.players || {}).length > 0 &&
      g?.options?.private === "public" &&
      !gameOverSelector({ playerId: "", game: g }).over
  );

  games = sortBy(games, [
    (g) => (g?.turns || []).length, // sort unstarted games first
    (g) => -g.createdAt, // then more recent games first
  ]);

  return {
    props: {
      games,
      locale
    },
    revalidate: 1,
  };
};

const PrivacyLink: React.FC = ({children}) => {
  return (
    <Link href="/privacy-policy">
      <a className="hover:text-gray-600 underline">{children}</a>
    </Link>
  )
}
