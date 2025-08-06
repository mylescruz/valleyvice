import SeasonsLayout from "@/component/seasons/seasonsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Seasons</title>
        <meta name="description" content="Valley Vice Seasons" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SeasonsLayout />
    </>
  );
}
