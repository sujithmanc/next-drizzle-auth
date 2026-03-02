

import { cookies } from "next/headers";
import { getCurrentUser, removeUserFromSession } from "./login/auth-utils";
import Navbar from "./Navbar";


export default async function Home() {

  return (
    <>
      <h1>Welcome to the Home Page</h1>
    </>
  );
}