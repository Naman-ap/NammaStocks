import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostCursorProps {
  steps: {
    targetId: string;
    action: 'click' | 'type';
    text?: string;
    delayBefore: number;
    onComplete?: () => void;
  }[];
  onAllComplete?: () => void;
}

const GhostCursor = ({ steps, onAllComplete }: GhostCursorProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight });
  const [isClicking, setIsClicking] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      if (onAllComplete) onAllComplete();
      return;
    }

    const step = steps[currentStepIndex];
    let timeoutId: NodeJS.Timeout;

    const executeStep = () => {
      const el = document.getElementById(step.targetId);
      if (!el) {
        console.warn(`GhostCursor: Target ${step.targetId} not found. Skipping.`);
        setCurrentStepIndex(prev => prev + 1);
        return;
      }

      const rect = el.getBoundingClientRect();
      // Move to center of element
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      // Wait for movement to finish (approx 1s), then perform action
      timeoutId = setTimeout(() => {
        if (step.action === 'click') {
          setIsClicking(true);
          setTimeout(() => {
            setIsClicking(false);
            if (step.onComplete) step.onComplete();
            
            // Move to next step after a short delay
            setTimeout(() => {
              setCurrentStepIndex(prev => prev + 1);
            }, 500);
          }, 200);
        } else if (step.action === 'type') {
          // Simulated typing effect could go here
          if (step.onComplete) step.onComplete();
          setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
          }, 500);
        }
      }, 1000); // Wait for cursor to travel
    };

    timeoutId = setTimeout(executeStep, step.delayBefore);

    return () => clearTimeout(timeoutId);
  }, [currentStepIndex, steps, onAllComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: position.x, y: position.y }}
        animate={{ 
          opacity: 1, 
          x: position.x, 
          y: position.y,
          scale: isClicking ? 0.8 : 1
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          x: { type: "spring", stiffness: 100, damping: 25 },
          y: { type: "spring", stiffness: 100, damping: 25 },
          scale: { duration: 0.1 }
        }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transformOrigin: "top left" }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
          className="drop-shadow-lg"
          style={{ transform: 'rotate(-20deg) scale(1.5)' }}
        >
          <path d="M4 4l16 5.333-7.556 2.222L10.222 19 4 4z" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
        {isClicking && (
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-6 h-6 bg-cyan-400 rounded-full"
            style={{ transform: 'translate(-25%, -25%)' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default GhostCursor;
