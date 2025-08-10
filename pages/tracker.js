import LoadingIndicator from "@/component/layout/loadingIndicator";
import StatsTrackerLayout from "@/component/statsTracker/statsTrackerLayout";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Tracker() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingIndicator />;
  } else if (!session) {
    router.push("/");
  } else {
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
}
