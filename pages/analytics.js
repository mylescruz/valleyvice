import AnalyticsLayout from "@/component/analytics/analyticsLayout";
import Head from "next/head";

export default function Analytics() {
  return (
    <>
      <Head>
        <title>Analytics</title>
        <meta name="description" content="Valley Vice Analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnalyticsLayout />
    </>
  );
}
