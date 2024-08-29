import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectMongo from '@/utils/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { email, name } = user
        await connectMongo()
        const userFound = await User.find({ email: email })
        if (userFound?.length === 0) {
          const newUser = new User({
            email,
            name,
          })
          await newUser.save()
        }
      } catch (error) {
        console.error('Error in signIn callback', error)
      } finally {
        return true
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session }) {
      await connectMongo()
      const foundUser = await User.findOne({ email: session?.user?.email })
      return { ...session, user: { ...session.user, role: foundUser.role } }
    },
    async jwt({ token }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }
