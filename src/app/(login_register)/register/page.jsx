"use client";
import React, { useState } from "react";
import { useSignUpEmailPassword } from "@nhost/nextjs";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    signUpEmailPassword,
    needsEmailVerification,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSignUpEmailPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("sdfdfd", email);

    try {
      const { error } = await signUpEmailPassword(email, password);

      if (error) {
        console.error("Sign-up error:", error);
        setLoading(false);
        return;
      }

      console.log("Sign-up successful!");
      router.back();
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-800 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
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
              {loading ? <span>Loading...</span> : <span>Sign Up</span>}
            </button>
          </div>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
