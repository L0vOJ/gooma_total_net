// loading_styles.js
import styled from 'styled-components';

export const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font: 1rem 'Noto Sans KR';
  text-align: center;
`;

// 로딩은 임시로 스크랩해서 사용
// 나중에... 따로 만들던가 해서 바꿀게요...
// 출처: https://anerim.tistory.com/221 [디발자 뚝딱:티스토리]