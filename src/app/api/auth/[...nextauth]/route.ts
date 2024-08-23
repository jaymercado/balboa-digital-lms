import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn(data) {
      return true
      //   try {
      //     const { email, name, image } = user
      //     await connectMongo()
      //     const userFound = await UserModel.find({ email: email })
      //     if (userFound?.length === 0) {
      //       const newUser = new UserModel({
      //         email,
      //         name,
      //         image,
      //         cart: [],
      //       })
      //       await newUser.save()
      //     }
      //   } catch (error) {
      //     console.log('Error in signIn callback', error)
      //   } finally {
      //     return true
      //   }
    },
    async redirect({ url, baseUrl }) {
      console.log('redirect', { url, baseUrl })
      return baseUrl
    },
    async session({ session, user, token }) {
      console.log('session', { session, user, token })
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt', { token, user, account, profile, isNewUser })
      return token
    },
  },
})

export { handler as GET, handler as POST }
