import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import connectDb from "./lib/db";

import User from "./models/user.models";
import Admin from "./models/admin.models";
import Partner from "./models/partner.models";

import bcrypt from "bcryptjs";

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },

                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },

            async authorize(credentials) {
                const email = credentials?.email as string;

                const password = credentials?.password as string;

                if (!email || !password) {
                    throw Error(
                        "Missing required Details"
                    );
                }

                await connectDb();

                // ADMIN
                let account = await Admin.findOne({
                        email,
                    });

                let role = "admin";

                // PARTNER
                if (!account) {
                    account =
                        await Partner.findOne({
                            email,
                        });

                    role = "partner";
                }

                // USER
                if (!account) {
                    account =
                        await User.findOne({
                            email,
                        });

                    role = "user";
                }

                if (!account) {
                    throw Error(
                        "User does not exist"
                    );
                }

                const isMatched =
                    await bcrypt.compare(
                        password,
                        account.password
                    );

                if (!isMatched) {
                    throw Error(
                        "Incorrect Password"
                    );
                }

                return {
                    id: account._id.toString(),
                    email: account.email,
                    name: account.name,
                    role,
                };
            },
        }),

        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({
            user,
            account,
        }) {
            if (
                account?.provider ===
                "google"
            ) {
                await connectDb();

                let dbUser =
                    await Admin.findOne({
                        email: user.email,
                    });

                if (dbUser) {
                    user.id =
                        dbUser._id.toString();

                    user.role = "admin";

                    return true;
                }

                dbUser =
                    await Partner.findOne({
                        email: user.email,
                    });

                if (dbUser) {
                    user.id =
                        dbUser._id.toString();

                    user.role = "partner";

                    return true;
                }

                dbUser =
                    await User.findOne({
                        email: user.email,
                    });

                if (dbUser) {
                    user.id =
                        dbUser._id.toString();

                    user.role = "user";

                    return true;
                }

                dbUser =
                    await User.create({
                        name:
                            user.name as string,
                        email:
                            user.email as string,
                        role: "user",
                    });

                user.id =
                    dbUser._id.toString();

                user.role = "user";
            }

            return true;
        },

        async jwt({
            token,
            user,
        }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }

            return token;
        },

        async session({
            session,
            token,
        }) {
            if (session.user) {
                session.user.id =
                    token.id as string;

                session.user.name =
                    token.name as string;

                session.user.email =
                    token.email as string;

                session.user.role =
                    token.role as string;
            }

            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin",
    },

    session: {
        strategy: "jwt",
        maxAge:
            10 * 24 * 60 * 60,
    },

    secret:
        process.env.AUTH_SECRET,
});