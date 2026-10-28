import { Fragment } from 'react';

type MaskedLinesProps = {
  lines: string[];
  as?: 'h1' | 'h2';
  className?: string;
};

export default function MaskedLines({ lines, as: Tag = 'h1', className = '' }: MaskedLinesProps) {
  return (
    <Tag className={`font-display uppercase ${className}`.trim()}>
      {lines.map((line, i) => (
        <Fragment key={`${i}-${line}`}>
          {i > 0 && ' '}
          <span className="block overflow-hidden">
            <span className="line block">{line}</span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
