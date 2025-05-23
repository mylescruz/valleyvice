import LoadingIndicator from "@/component/layout/loadingIndicator";
import RosterLayout from "@/component/roster/rosterLayout";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Roster() {
  const router = useRouter();

  const seasonNum = router.query.seasonNum;

  if (!seasonNum) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <Head>
          <title>Roster</title>
          <meta name="description" content="Valley Vice Roster" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <RosterLayout seasonNum={seasonNum} />
      </>
    );
  }
}
