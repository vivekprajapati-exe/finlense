import { db } from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // First, try to find by clerkUserId
    let dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        accounts: true,
        transactions: {
          orderBy: { date: "desc" },
          take: 5,
        },
        budgets: true,
      }
    });

    // If not found by clerkUserId, try by email as fallback
    if (!dbUser && user.emailAddresses?.length > 0) {
      const email = user.emailAddresses[0].emailAddress;
      
      dbUser = await db.user.findUnique({
        where: { email },
        include: {
          accounts: true,
          transactions: {
            orderBy: { date: "desc" },
            take: 5,
          },
          budgets: true,
        }
      });
      
      // If found by email, update the clerkUserId to fix the connection
      if (dbUser) {
        dbUser = await db.user.update({
          where: { id: dbUser.id },
          data: { clerkUserId: user.id },
          include: {
            accounts: true,
            transactions: {
              orderBy: { date: "desc" },
              take: 5,
            },
            budgets: true,
          }
        });
        console.log("User connection fixed: Updated clerkUserId for existing user");
      }
    }

    // If user exists in the database, return it
    if (dbUser) {
      return dbUser;
    }

    // If user doesn't exist, create a new one
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'Anonymous User';
    const email = user.emailAddresses?.length > 0 
      ? user.emailAddresses[0].emailAddress 
      : null;

    if (!email) {
      throw new Error("No email address found for user");
    }

    // Try to create the user
    try {
      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          email,
        },
        include: {
          accounts: true,
          transactions: true,
          budgets: true,
        }
      });
      
      return newUser;
    } catch (createError) {
      // If creation fails due to duplicate email, try to connect to existing user
      if (createError.code === 'P2002' && createError.meta?.target?.includes('email')) {
        const existingUser = await db.user.findUnique({
          where: { email },
          include: {
            accounts: true,
            transactions: {
              orderBy: { date: "desc" },
              take: 5,
            },
            budgets: true,
          }
        });
        
        if (existingUser) {
          // Update the existing user with the new clerkUserId
          const updatedUser = await db.user.update({
            where: { id: existingUser.id },
            data: { clerkUserId: user.id },
            include: {
              accounts: true,
              transactions: {
                orderBy: { date: "desc" },
                take: 5,
              },
              budgets: true,
            }
          });
          
          console.log("Fixed user connection: Updated existing user with new clerkUserId");
          return updatedUser;
        }
      }
      
      throw createError;
    }
  } catch (error) {
    console.error("Database sync failed:", error);
    throw new Error("Database sync failed: " + error.message);
  }
}