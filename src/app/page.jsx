

import { cookies } from "next/headers";
import { getCurrentUser, removeUserFromSession } from "./login/auth-utils";
import LogoutButton from "@/features/auth/components/LogoutButton";

export async function logoutAction() {
  await removeUserFromSession();
}

export default async function Home() {
  const sessionInfo = await getCurrentUser( { redirectIfNotFound: true } );

  return (
    <>
      <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
      <LogoutButton />
    </>
  );
}