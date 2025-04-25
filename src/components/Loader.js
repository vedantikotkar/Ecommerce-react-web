import { useState, useEffect } from 'react';

export default function CircleLoader() {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 10);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-64">
      <div 
        className="relative w-32 h-32" 
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.01s linear'
        }}
      >
        {/* Circle 1 - Left */}
        <div className="absolute w-8 h-8 bg-blue-400 rounded-full opacity-70 animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-16px',
            marginTop: '-16px',
            animation: 'pulse 2.5s infinite, moveLeft 2.5s infinite ease-in-out'
          }}
        ></div>
        
        {/* Circle 2 - Bottom */}
        <div className="absolute w-8 h-8 bg-blue-600 rounded-full opacity-70 animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-16px',
            marginTop: '-16px',
            animation: 'pulse 2.5s infinite, moveBottom 2.5s infinite ease-in-out'
          }}
        ></div>
        
        {/* Circle 3 - Right */}
        <div className="absolute w-8 h-8 bg-cyan-400 rounded-full opacity-70 animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-16px',
            marginTop: '-16px',
            animation: 'pulse 2.5s infinite, moveRight 2.5s infinite ease-in-out'
          }}
        ></div>
        
        {/* Circle 4 - Top */}
        <div className="absolute w-8 h-8 bg-blue-200 rounded-full opacity-70 animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-16px',
            marginTop: '-16px',
            animation: 'pulse 2.5s infinite, moveTop 2.5s infinite ease-in-out'
          }}
        ></div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(0.6); opacity: 1; }
        }
        
        @keyframes moveLeft {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-30px) scale(0.6); }
        }
        
        @keyframes moveBottom {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(30px) scale(0.6); }
        }
        
        @keyframes moveRight {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(30px) scale(0.6); }
        }
        
        @keyframes moveTop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(0.6); }
        }
      `}</style>
    </div>
  );
}