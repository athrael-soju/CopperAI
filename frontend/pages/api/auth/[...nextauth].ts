import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb/client';

// export default NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//    GoogleProvider({
//   clientId: process.env.GOOGLE_CLIENT_ID ?? '',
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
//   }),
//   ],
//   secret: process.env.JWT_SECRET ?? '',
//   //remove the code below to allow any email domain to sign in
//   callbacks: {
//     async signIn({ account, profile }) {
//       if (account?.provider === 'google') {
//         return (
//           profile?.email?.endsWith(process.env.ALLOWED_EMAIL_DOMAIN ?? '') ??
//           false
//         );
//       }
//       return true;
//     },
//   },
//   //remove the code above to allow any email domain to sign in
// });

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as NextAuthOptions['adapter'],
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
};

export default NextAuth(authOptions);
