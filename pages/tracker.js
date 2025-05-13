import StatsTrackerLayout from "@/component/statsTracker/statsTrackerLayout";
import Head from "next/head";

export default function Tracker() {
  return (
    <>
      <Head>
        <title>Stats Tracker</title>
        <meta name="description" content="Valley Vice Stats Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StatsTrackerLayout />
    </>
  );
}
