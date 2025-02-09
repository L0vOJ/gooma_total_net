import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  // uri: 'http://localhost:3000/api/graphql', // Keystone GraphQL API 경로
  // uri: 'https://localhost:3111/api/graphql', // Keystone GraphQL API 경로
  uri: 'https://netgooma.ddns.net/api/graphql', // Keystone GraphQL API 경로
  cache: new InMemoryCache(),
  credentials: 'include', // 쿠키를 포함하여 요청
});

export default client;
