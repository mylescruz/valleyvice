import EditGameLayout from "@/component/editGame/editGameLayout";
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
            Edit Season {seasonNumber} Game {gameNumber}
          </title>
          <meta name="description" content="Edit Valley Vice Game Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <EditGameLayout seasonNumber={seasonNumber} gameNumber={gameNumber} />
      </>
    );
  }
}
