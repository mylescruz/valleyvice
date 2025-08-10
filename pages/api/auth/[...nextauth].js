import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.providerAccountId = account.providerAccountId;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.idToken = token.idToken;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const allowedAdmins = process.env.ADMINS.split(",").map((email) =>
          email.trim()
        );
        return (
          profile.email.endsWith("@gmail.com") &&
          profile.email_verified &&
          allowedAdmins.includes(user.email)
        );
      } else {
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
