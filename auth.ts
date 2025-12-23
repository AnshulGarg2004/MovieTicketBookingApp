import { auth, clerkClient } from "@clerk/nextjs/server";

export async function protectAdmin() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    if (user.publicMetadata?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    return user;
}
