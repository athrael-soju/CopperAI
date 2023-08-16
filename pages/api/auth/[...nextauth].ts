import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../lib/client/mobgodb';

export const authOptions: NextAuthOptions = {
  // @ts-ignore - Argument of type 'Promise<MongoClient> | undefined' is not assignable to parameter of type 'Promise<MongoClient>'. Type 'undefined' is not assignable to type 'Promise<MongoClient>'.ts(2345)
  adapter: MongoDBAdapter(clientPromise) as NextAuthOptions['adapter'],

  providers: [
    // Disable until issue with mongodb storing the email is fixed
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
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
