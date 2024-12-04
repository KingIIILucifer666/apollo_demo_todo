import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://lofjjhhrgxppxvcptnfh.graphql.eu-west-2.nhost.run/v1",
  cache: new InMemoryCache(),
});
