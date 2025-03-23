import React from 'react';
import styled from '@emotion/styled';

const GradientContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(-45deg, #ffffff, #f8f9fa, #f1f3f5, #ffffff);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

interface AnimatedGradientProps {
  children: React.ReactNode;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ children }) => {
  return <GradientContainer>{children}</GradientContainer>;
};

export default AnimatedGradient; 