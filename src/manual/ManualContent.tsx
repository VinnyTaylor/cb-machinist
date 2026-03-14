import React from 'react';
import { ChapterContent } from './chapters';
import { CodeBlock } from '../components/CodeBlock';
import { NoteBox } from '../components/NoteBox';
import './ManualContent.css';

interface ManualContentProps {
  content: ChapterContent[];
}

export const ManualContent: React.FC<ManualContentProps> = ({ content }) => {
  return (
    <div className="manual-content">
      {content.map((item, index) => {
        switch (item.type) {
          case 'heading':
            return (
              <h4 key={index} className="content-heading">
                {item.text}
              </h4>
            );

          case 'paragraph':
            return (
              <p key={index} className="content-paragraph">
                {item.text}
              </p>
            );

          case 'formula':
            return (
              <div key={index} className="content-formula">
                <code>{item.text}</code>
              </div>
            );

          case 'note':
            return (
              <NoteBox key={index} variant="info" title={item.title}>
                {item.text}
              </NoteBox>
            );

          case 'warning':
            return (
              <NoteBox key={index} variant="warning" title={item.title}>
                {item.text}
              </NoteBox>
            );

          case 'code':
            return (
              <CodeBlock key={index} code={item.text || ''} showCopy={true} />
            );

          case 'list':
            return (
              <ul key={index} className="content-list">
                {item.items?.map((listItem, i) => (
                  <li key={i}>{listItem}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
