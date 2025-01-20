import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql', // Keystone GraphQL API 경로
  cache: new InMemoryCache(),
});

export default client;
