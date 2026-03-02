import { comparePasswords, generateSalt, hashPassword } from "@/auth/password";
import RedisDemoData from "@/features/redis/components/RedisDemoData";
import { db2 } from "@/drizzle/db";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default async function Home() {

  const myPassword = "mySecurePassword";
  const salt = generateSalt();

  const pass = await hashPassword(myPassword, salt);
  const pass2 = await hashPassword(myPassword, salt);
  const isMatch = await comparePasswords({
    password: myPassword,
    salt,
    hashedPassword: pass,
  });

  // DB Test
  const users = await db2.query.emp.findMany();
  return (
    <>
      <SignUpForm />
      <RedisDemoData />
      <pre>{pass}</pre>
      <pre>{pass2}</pre>
      <pre>{salt}</pre>
      <pre>{isMatch ? "Passwords match!" : "Passwords do not match."}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}