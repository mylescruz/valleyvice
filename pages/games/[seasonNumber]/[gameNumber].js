import GameLayout from "@/component/game/gameLayout";
import LoadingIndicator from "@/component/layout/loadingIndicator";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const seasonNumber = parseInt(router.query.seasonNumber);
  const gameNumber = parseInt(router.query.gameNumber);

  if (!seasonNumber || !gameNumber) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <Head>
          <title>
            Season {seasonNumber} Game {gameNumber}
          </title>
          <meta name="description" content="Valley Vice Game Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <GameLayout seasonNumber={seasonNumber} gameNumber={gameNumber} />
      </>
    );
  }
}
