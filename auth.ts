import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "@/src/lib/auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        // Get user from database and verify password
        const user = await getUserFromDb(credentials.email as string, credentials.password as string)
 
        if (!user) {
          // No user found or invalid credentials
          throw new Error("Invalid credentials")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.role = user.role
        token.companyId = user.companyId
        token.departmentId = user.departmentId
      }
      return token
    },
    session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.departmentId = token.departmentId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})