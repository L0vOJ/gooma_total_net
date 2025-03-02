// CustomDocumentRenderer.js
import React from 'react';

function renderCustomNode(node) {
  if (!node) return null;

  switch (node.type) {
    case 'paragraph':
      return (
        <p style={{ margin: '1em 0', textAlign: node.textAlign || 'left' }}>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </p>
      );
    case 'ordered-list':
      return (
        <ol style={{ marginLeft: '1.5em', paddingLeft: '1em' }}>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </ol>
      );
    case 'unordered-list':
      return (
        <ul style={{ marginLeft: '1.5em', paddingLeft: '1em' }}>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </ul>
      );
    case 'list-item':
      return (
        <li>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </li>
      );
    case 'list-item-content':
      return (
        <>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </>
      );
    case 'link':
      return (
        <a href={node.href} style={{ color: 'blue', textDecoration: 'underline' }}>
          {node.children && node.children.map((child, idx) => (
            <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
          ))}
        </a>
      );
    default:
      // 텍스트 노드 처리: node.text가 존재하면 이를 렌더링
      if (typeof node.text === 'string') {
        let textContent = node.text;
        if (node.bold) textContent = <strong>{textContent}</strong>;
        if (node.italic) textContent = <em>{textContent}</em>;
        if (node.underline) textContent = <u>{textContent}</u>;
        return textContent;
      }
      // 기타 노드: 자식이 있을 경우 재귀 처리
      return node.children ? node.children.map((child, idx) => (
        <React.Fragment key={idx}>{renderCustomNode(child)}</React.Fragment>
      )) : null;
  }
}

export default function CustomDocumentRenderer({ document }) {
  return (
    <div>
      {document.map((node, idx) => (
        <React.Fragment key={idx}>{renderCustomNode(node)}</React.Fragment>
      ))}
    </div>
  );
}