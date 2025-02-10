import { ApolloClient, InMemoryCache, createHttpLink  } from '@apollo/client'; //ApolloProvider
import { setContext } from '@apollo/client/link/context';

// const httpLink = createHttpLink({
//   // uri: 'http://localhost:3000/api/graphql', // Keystone GraphQL API 경로
//   uri: 'https://netgooma.ddns.net/api/graphql',
//   credentials: 'include', // 세션 쿠키 포함
// });

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       'X-No-Redirect': 'true', // API 요청임을 서버에 알림
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

const client = new ApolloClient({
  // uri: 'http://localhost:3000/api/graphql', // Keystone GraphQL API 경로
  uri: 'https://netgooma.ddns.net/api/graphql', // Keystone GraphQL API 경로
  cache: new InMemoryCache(),
  credentials: 'include', // 쿠키를 포함하여 요청
});

export default client;
