
import "./globals.css";
import { getCurrentUser } from "./login/auth-utils";
import Navbar from "./Navbar";

export default async function RootLayout({ children }) {

  const sessionInfo = await getCurrentUser({ redirectIfNotFound: false });

  return (
    <html lang="en">
      <body>
        <Navbar user={sessionInfo} />
        {children}
      </body>
    </html>
  );
}
