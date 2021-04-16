import React from 'react';

interface Props {
  className: string;
}

const PlayingIcon: React.FC<Props> = (props: Props) => {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="PlayingIcon equilizer"
      viewBox="0 0 100 100"
    >
      <g>
        <title>Audio Equilizer</title>
        <rect className="bar" transform="translate(0,0)" y="15" ry="10" />
        <rect className="bar" transform="translate(25,0)" y="15" ry="10" />
        <rect className="bar" transform="translate(50,0)" y="15" ry="10" />
        <rect className="bar" transform="translate(75,0)" y="15" ry="10" />
      </g>
    </svg>
  );
};

export default PlayingIcon;
