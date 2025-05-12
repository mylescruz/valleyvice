import LoadingIndicator from "@/component/layout/loadingIndicator";
import SeasonsLayout from "@/component/seasons/seasonsLayout";
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
          <title>Seasons</title>
          <meta name="description" content="Valley Vice Seasons" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SeasonsLayout seasonNum={seasonNum} />
      </>
    );
  }
}
