import StatsLayout from "@/component/stats/statsLayout";
import Head from "next/head";

export default function Stats() {
  return (
    <>
      <Head>
        <title>Stats</title>
        <meta name="description" content="Valley Vice Stats" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StatsLayout />
    </>
  );
}
