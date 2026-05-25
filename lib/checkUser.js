import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {

    console.log("CHECK USER RUNNING");

    const user = await currentUser();

    console.log(user?.id);

    if (!user) {
        return null;
    }

    try {

        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        console.log("CREATING USER");

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
            },
        });

        return newUser;

    } catch (error) {
        console.log(error.message);
    }
};