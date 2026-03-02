import { getCurrentUser } from "../login/auth-utils";

export default async function ProtectedLayout({ children }) {

    const user = await getCurrentUser({ redirectIfNotFound: true }); // This will throw if the user is not authenticated, preventing access to the layout and its children

    return (
        <div>
            <h1>Protected Layout</h1>
            <p>This is the protected layout. Only authenticated users can see this.</p>
            {children}
            <pre>
                {JSON.stringify(user, null, 2) }
            </pre>
        </div>
    );
}