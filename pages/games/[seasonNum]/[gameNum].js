import GameLayout from "@/component/game/gameLayout";
import LoadingIndicator from "@/component/layout/loadingIndicator";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const seasonNum = parseInt(router.query.seasonNum);
  const gameNum = parseInt(router.query.gameNum);

  if (!seasonNum || !gameNum) return <LoadingIndicator />;
  else {
    return (
      <>
        <Head>
          <title>
            Season {seasonNum} Game {gameNum}
          </title>
          <meta name="description" content="Valley Vice Game Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <GameLayout seasonNum={seasonNum} gameNum={gameNum} />
      </>
    );
  }
}
