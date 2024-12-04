"use client";
import { apolloClient } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import React from "react";

const ApolloClientProvider = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <body>{children}</body>
    </ApolloProvider>
  );
};

export default ApolloClientProvider;
