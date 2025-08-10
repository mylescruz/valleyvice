import Error404 from "@/component/layout/error404";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>404 Error</title>
        <meta name="description" content="404 Error Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Error404 />
    </>
  );
}
