import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

const LogoContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  text-align: center;
`;

const LogoText = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

const VPiText = styled.span`
  color: #2d3748;
`;

const ScoreText = styled.span`
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DarkText = styled.span`
  color: #2d3748;
`;

interface LogoProps {
  startDelay?: number;
  onAnimationComplete?: () => void;
}

const Logo: React.FC<LogoProps> = ({ startDelay = 0, onAnimationComplete }) => {
  const [currentText, setCurrentText] = useState('VPi Score');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentText('The real score');
    }, 2000 + startDelay);

    const timer2 = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000 + startDelay);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [startDelay, onAnimationComplete]);

  return (
    <LogoContainer>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LogoText>
              {currentText === 'VPi Score' ? (
                <>
                  <VPiText>VPi</VPiText>
                  <ScoreText> Score</ScoreText>
                </>
              ) : (
                <>
                  <DarkText>The </DarkText>
                  <ScoreText>real</ScoreText>
                  <DarkText> score</DarkText>
                </>
              )}
            </LogoText>
          </motion.div>
        )}
      </AnimatePresence>
    </LogoContainer>
  );
};

export default Logo; 