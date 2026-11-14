import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDatabase } from '@/lib/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        // 1. Check in MongoDB Users Collection
        try {
          const db = await getDatabase();
          const user = await db.collection('users').findOne({ email: inputEmail });

          if (user && user.password === inputPassword) {
            return {
              id: user._id.toString(),
              name: user.name || 'Khulna Gazette User',
              email: user.email,
              role: user.role || 'admin'
            };
          }
        } catch (dbErr) {
          console.warn('MongoDB query warning (falling back to env credentials):', dbErr.message);
        }

        // 2. Fallback to Environment Admin Credentials
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@khulnagazette.com').toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (inputEmail === adminEmail && inputPassword === adminPassword) {
          return {
            id: '1',
            name: 'Khulna Gazette Admin',
            email: adminEmail,
            role: 'admin'
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 দিন (30 Days)
    updateAge: 24 * 60 * 60 // ২৪ ঘণ্টা পর পর সেশন রিফ্রেশ হবে
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 দিন
  },
  secret: process.env.NEXTAUTH_SECRET || 'khulna-gazette-secret-key-2026'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
