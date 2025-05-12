import HomeLayout from "@/component/home/homeLayout";
import Head from "next/head";

export default function Home() {
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
