// Loading.js
import React from 'react';
import {Background, LoadingText} from './loading_styles';

export default () => {
  return (
    <Background>
      <LoadingText>잠시만 기다려 주세요.</LoadingText>
    </Background>
  );
};
// 로딩은 임시로 스크랩해서 사용
// 나중에... 따로 만들던가 해서 바꿀게요...
// 출처: https://anerim.tistory.com/221 [디발자 뚝딱:티스토리]