

import { cookies } from "next/headers";
import { getLoggedInUser, removeUserFromSession } from "./login/auth-utils";
import LogoutButton from "@/features/auth/components/LogoutButton";

export async function logoutAction() {
  await removeUserFromSession();
}

export default async function Home() {
  const sessionInfo = await getLoggedInUser();

  return (
    <>
      <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
      <LogoutButton />
    </>
  );
}