// pages/login.js
import { useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
// 만약 Next.js를 사용한다면: import { useRouter } from 'next/router';

const AUTHENTICATE_USER_WITH_PASSWORD = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [authenticateUser, { loading }] = useMutation(AUTHENTICATE_USER_WITH_PASSWORD);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const { data } = await authenticateUser({
        variables: { email, password },
      });
      const authResult = data.authenticateUserWithPassword;
      if (authResult.sessionToken) {
        // 로그인 성공: sessionToken이 존재하므로 세션 쿠키가 발급됨
        //완료 팝업 추가 해야 함
        await client.resetStore();
        navigate('/');
      } else if (authResult.message) {
        // 인증 실패 시 메시지 표시
        setErrorMsg(authResult.message);
      } else {
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('로그인 요청 오류:', err);
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ddd' }}>
      <h1>로그인</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">이메일:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">비밀번호:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
