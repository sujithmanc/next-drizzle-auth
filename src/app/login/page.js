import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth-utils";
import LoginForm from "./LoginForm";


export default async function LoginPage() {
    const currentUser = await getCurrentUser({ redirectIfNotFound: false });
    if (currentUser) {
        redirect("/");
    }
    return (
        <div>
            <LoginForm />
        </div>
    );
}