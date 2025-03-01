import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';

// 커스텀 렌더러 정의 (타입 정보 없이 순수 JS로 작성)
const renderers = {
  block: {
    // 단락 렌더러: 텍스트 정렬을 지원
    paragraph({ children, textAlign }) {
      return (
        <p style={{ textAlign: textAlign || 'left', margin: '1em 0', lineHeight: 1.5 }}>
          {children}
        </p>
      );
    },
    // 제목 렌더러: level에 따라 h1, h2 등으로 렌더링
    heading({ level, children, textAlign }) {
      const Tag = 'h' + level;
      return (
        <Tag style={{ textAlign: textAlign || 'left', fontWeight: 'bold', margin: '1em 0' }}>
          {children}
        </Tag>
      );
    },
    // 번호 목록(ordered list) 렌더러
    orderedList({ children }) {
      return (
        <ol style={{ marginLeft: '1.5em', paddingLeft: '1em' }}>
          {children}
        </ol>
      );
    },
    // 일반 목록(unordered list) 렌더러
    unorderedList({ children }) {
      return (
        <ul style={{ marginLeft: '1.5em', paddingLeft: '1em' }}>
          {children}
        </ul>
      );
    },
    // 목록 항목(list item) 렌더러
    listItem({ children }) {
      return <li style={{ marginBottom: '0.5em' }}>{children}</li>;
    },
    // 레이아웃 블록 등 다른 블록 타입도 필요에 따라 추가 가능
  },
  inline: {
    // 인라인 서식 렌더러
    bold({ children }) {
      return <strong>{children}</strong>;
    },
    italic({ children }) {
      return <em>{children}</em>;
    },
    underline({ children }) {
      return <u>{children}</u>;
    },
    link({ href, children }) {
      return (
        <a href={href} style={{ color: 'blue', textDecoration: 'underline' }}>
          {children}
        </a>
      );
    },
  },
};


export default function KeystoneRenderer({ document }) {
  return <DocumentRenderer document={document} renderers={renderers} />;
}
