import HomeLayout from "@/component/home/homeLayout";
import LoadingIndicator from "@/component/layout/loadingIndicator";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <Head>
          <title>Valley Vice</title>
          <meta name="description" content="Valley Vice Stats" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <HomeLayout />
      </>
    );
  }
}
