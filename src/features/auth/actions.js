'use server'

import { removeUserFromSession } from "@/app/login/auth-utils";
import { userService } from "@/drizzle/user-service"
import { redirect } from "next/navigation";

export async function signUpAction(formData) {

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: formData.get('password'),
  }



  const result = await userService.insert(data);

  console.log('[SignUp]', data, result)
}

export async function loginAction(formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  console.log('[Login]', data)
}

export async function logoutAction() {
  try {
    await removeUserFromSession();
  } catch (error) {
    return { message: "Failed to logout" };
  }

  // Redirecting outside try/catch is a Next.js best practice
  redirect("/login");
}