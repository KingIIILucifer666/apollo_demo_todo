"use client";
import { useSignInEmailPassword } from "@nhost/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInEmailPassword, error } = useSignInEmailPassword();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signInEmailPassword(email, password);

    if (error) {
      console.error({ error });
      setLoading(false);
      return;
    }

    setLoading(false);
    console.log("Sign-in successful!");
    router.back();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-800 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-zinc-800"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-zinc-800"
            />
          </div>
          <div>
            <button disabled={loading} className="p-4 bg-zinc-800">
              {loading ? <span>Loading...</span> : <span>Sign In</span>}
            </button>
          </div>
          {error && <p className="text-red-700">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
