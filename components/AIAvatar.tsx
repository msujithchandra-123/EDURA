import React from 'react';

interface AIAvatarProps {
  isTalking?: boolean;
  className?: string;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ isTalking = false, className = '' }) => {
  const talkingMouth = (
    <path d="M 20 60 Q 30 55 40 60 Q 30 65 20 60 Z" fill="white" className="mouth-talking" />
  );

  const idleMouth = (
    <path d="M 25 60 L 35 60" stroke="white" strokeWidth="2" strokeLinecap="round" />
  );

  return (
    <>
      <style>{`
        .eye {
          animation: blink 4s infinite ease-in-out;
        }
        @keyframes blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97.5% { transform: scaleY(0.1); }
        }
        .hand-right {
          animation: wave 5s infinite ease-in-out;
          transform-origin: 20% 90%;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(10deg); }
          20% { transform: rotate(-5deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(0deg); }
        }
        .mouth-talking {
          animation: talk 0.3s infinite;
          transform-origin: center;
        }
        @keyframes talk {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5) scaleX(1.2); }
        }
      `}</style>
      <div className={`relative w-48 h-48 ${className}`}>
        {/* Head */}
        <svg viewBox="0 0 60 80" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-auto">
          {/* Body */}
          <path d="M 10 70 C 10 50, 50 50, 50 70 L 45 80 L 15 80 Z" fill="#60a5fa" />
          {/* Neck */}
          <rect x="25" y="45" width="10" height="10" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="30" cy="30" r="20" fill="#fbcfe8" />
          {/* Hair */}
          <path d="M 10 30 A 20 20 0 0 1 50 30 A 10 10 0 0 0 30 10 A 10 10 0 0 0 10 30" fill="#4a5568" />
          {/* Eyes */}
          <circle cx="22" cy="30" r="3" fill="white" className="eye" />
          <circle cx="38" cy="30" r="3" fill="white" className="eye" />
          <circle cx="22" cy="30" r="1.5" fill="black" className="eye" />
          <circle cx="38" cy="30" r="1.5" fill="black" className="eye" />
          {/* Mouth */}
          {isTalking ? talkingMouth : idleMouth}
          
          {/* Hands */}
          <g className={isTalking ? 'hand-right' : ''}>
            <path d="M 50 70 C 55 60, 65 65, 60 75 Z" fill="#fbcfe8" />
          </g>
           <path d="M 10 70 C 5 60, -5 65, 0 75 Z" fill="#fbcfe8" />
        </svg>
      </div>
    </>
  );
};

export default AIAvatar;
