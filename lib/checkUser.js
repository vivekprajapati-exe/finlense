import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Check if user already exists in database
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        accounts: true,
        budgets: true,
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 transactions for dashboard
        }
      }
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user if doesn't exist
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'Anonymous User';

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl || null,
        email: user.emailAddresses[0].emailAddress,
      },
      include: {
        accounts: true,
        budgets: true,
        transactions: true
      }
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    throw new Error(`Database sync failed: ${error.message}`);
  }
}