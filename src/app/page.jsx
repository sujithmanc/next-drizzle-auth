
import { getUserFromSession } from "@/auth/session";
import { cookies } from "next/headers";

export default async function Home() {

    const sessionInfo = getUserFromSession(await cookies())


  return (
    <>
      <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
    </>
  );
}