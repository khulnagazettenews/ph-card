'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError(true);
      setPassword('');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Khulna Gazette Logo" className="login-logo-img" />
          <h2>কার্ড জেনারেটর লগইন</h2>
          <p>অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন।</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="loginEmail">ইমেইল ঠিকানা</label>
            <input
              type="email"
              id="loginEmail"
              placeholder="যেমন: admin@khulnagazette.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="loginPassword">পাসওয়ার্ড</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="login-error-msg">
              ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়!
            </div>
          )}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
