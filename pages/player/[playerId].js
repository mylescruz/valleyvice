import LoadingIndicator from "@/component/layout/loadingIndicator";
import PlayerLayout from "@/component/player/playerLayout";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const playerId = router.query.playerId;

  if (!playerId) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <Head>
          <title>Player Stats</title>
          <meta name="description" content="Valley Vice Game Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PlayerLayout playerId={playerId} />
      </>
    );
  }
}
