// app/context/ClientNhostProvider.js

"use client";

import { NhostProvider } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { nhost } from "@/lib/nhost";

const NhostApolloClientProvider = ({ children }) => {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>{children}</NhostApolloProvider>
    </NhostProvider>
  );
};

export default NhostApolloClientProvider;
