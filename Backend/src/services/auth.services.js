import { db } from "../libs/database.js";

export async function getUserWithOAuthId({ email, provider }) {
      const user = await db.user.findFirst({
            where: {
                  email: email,
                  oauthAccounts: {
                        some: {
                              provider: provider
                        }
                  }
            },
            include: {
                  oauthAccounts: {
                        where: {
                              provider: provider
                        },
                        select: {
                              provider: true,
                              providerId: true
                        }
                  }
            }
      });

      if (!user) return null;

      const oauth = user.oauthAccounts?.[0];

      return {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: oauth?.provider || null,
            providerId: oauth?.providerId || null
      };
};

export async function linkUserWithOAuth({
      userId,
      provider,
      providerId
}) {
      await db.oAuthAccount.create({
            data: {
                  userId,
                  provider,
                  providerId
            }
      })
};

export async function createUserWithOAuth({
      name,
      email,
      provider,
      providerId,
}) {

      const user = await db.$transaction(async (trx) => {
            const user = await trx.user.create({
                  data: {
                        name,
                        email,
                        username,
                        password: "", // Empty password for OAuth users
                        role: Role.USER, // Default role
                  },
            });

            // Create the OAuth account
            await trx.oAuthAccount.create({
                  data: {
                        provider,
                        providerId: providerId,
                        userId: user.id,
                  },
            });

            return user;
      });

      return {
            id: user.id,
            name: user.name,
            email: user.email,
            provider,
            providerId,
      };
}