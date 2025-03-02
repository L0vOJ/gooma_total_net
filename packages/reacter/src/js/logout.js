// gooma_total_net/packages/reacter/src/js/LogoutButton.js
import React from 'react';
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; // 혹은 Next.js의 useRouter 사용

export default function Logout() {
  const client = useApolloClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 포함
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      // Apollo Client의 캐시를 초기화하여 최신 인증 상태를 반영
      await client.resetStore();
      // 로그인 페이지 또는 원하는 경로로 이동
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    // <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
    //   로그아웃
    // </button> 
    // , "textAlign": "left", "padding": '0rem 1rem' 
    <p onClick={handleLogout} style={{ "cursor" : "pointer" }}> 
      로그아웃
    </p>
    //
  );
}
