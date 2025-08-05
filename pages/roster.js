import RosterLayout from "@/component/roster/rosterLayout";
import Head from "next/head";

export default function Roster() {
  return (
    <>
      <Head>
        <title>Roster</title>
        <meta name="description" content="Valley Vice Roster" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RosterLayout />
    </>
  );
}
