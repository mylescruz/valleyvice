import InfoLayout from "@/component/info/infoLayout";
import LoadingIndicator from "@/component/layout/loadingIndicator";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Info() {
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
          <title>Valley Vice Info</title>
          <meta name="description" content="Valley Vice Stats Info" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <InfoLayout />
      </>
    );
  }
}
