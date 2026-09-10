import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@khulnagazette.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return {
            id: '1',
            name: 'Khulna Gazette Admin',
            email: adminEmail
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
