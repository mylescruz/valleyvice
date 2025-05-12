import LoadingIndicator from "@/component/layout/loadingIndicator";
import StatsLayout from "@/component/stats/statsLayout";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  const seasonNum = parseInt(router.query.seasonNum);

  if (!seasonNum) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <Head>
          <title>Season {seasonNum} Stats</title>
          <meta name="description" content="Valley Vice Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <StatsLayout seasonNum={seasonNum} />
      </>
    );
  }
}
