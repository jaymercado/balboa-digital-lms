import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectSupabase from '@/utils/databaseConnection'

const authOptions: NextAuthOptions = {
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
        const supabase = await connectSupabase()
        if (!supabase) throw new Error('Failed to connect to Supabase')

        const foundUser = await supabase.from('users').select('*').eq('email', email)
        if (!foundUser.data?.length) {
          await supabase.from('users').insert({ email, name })
        }
      } catch (error) {
        console.error('Error in signIn callback', error)
        return false
      } finally {
        return true
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session }) {
      const supabase = await connectSupabase()
      if (!supabase) throw new Error('Failed to connect to Supabase')
      const foundUser = await supabase.from('users').select('*').eq('email', session?.user?.email)
      return { ...session, user: { ...session.user, role: foundUser.data?.[0].role } }
    },
    async jwt({ token, user }) {
      if (user) {
        const supabase = await connectSupabase()
        if (!supabase) throw new Error('Failed to connect to Supabase')
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single()

        token.role = data?.role || 'student'
      }
      return token
    },
  },
}

export default authOptions
