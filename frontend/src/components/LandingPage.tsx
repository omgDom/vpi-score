import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import AnimatedGradient from './AnimatedGradient';
import Logo from './Logo';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  VStack,
  Button,
  useDisclosure,
  Text,
  Link,
} from '@chakra-ui/react';

const LoginButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 20;
  color: #4a5568;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0;

  &:hover {
    color: #3182ce;
  }
` as typeof motion.button;

const VerticalDivider = styled(motion.div)`
  width: 1px;
  height: 100vh;
  background: linear-gradient(to top, transparent, rgba(49, 130, 206, 0.7), transparent);
  transform-origin: bottom;
  position: fixed;
  left: 50%;
  top: 0;
  z-index: 10;
`;

const SectionButton = styled(motion.button)`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  transition: color 0.2s;
  opacity: 0;
  border: none;
  background: none;
  cursor: pointer;
  padding: 1rem;
  letter-spacing: 0.5px;

  &:hover {
    color: #3182ce;
  }
` as typeof motion.button;

const LandingPage: React.FC = () => {
  const [showSections, setShowSections] = useState(false);
  const { isOpen: isWaitlistOpen, onOpen: onWaitlistOpen, onClose: onWaitlistClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const [modalType, setModalType] = useState<'business' | 'creator'>('business');

  const handleLogoAnimationComplete = () => {
    setShowSections(true);
  };

  const openModal = (type: 'business' | 'creator') => {
    setModalType(type);
    onWaitlistOpen();
  };

  return (
    <AnimatedGradient>
      <LoginButton
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 5.4, ease: "easeOut" }}
        onClick={onLoginOpen}
      >
        Already have an account? Log in
      </LoginButton>

      <Logo 
        startDelay={0} 
        onAnimationComplete={handleLogoAnimationComplete} 
      />
      
      <VerticalDivider
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 4, ease: "easeOut" }}
      />
      
      <SectionButton
        onClick={() => openModal('business')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 5.2, ease: "easeOut" }}
        style={{ left: '50%' }}
      >
        Business
      </SectionButton>
      
      <SectionButton
        onClick={() => openModal('creator')}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 5.2, ease: "easeOut" }}
        style={{ left: 0 }}
      >
        Creator
      </SectionButton>

      {/* Waitlist Modal */}
      <Modal isOpen={isWaitlistOpen} onClose={onWaitlistClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Join the Waitlist - {modalType === 'business' ? 'Business' : 'Creator'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={(e) => {
              e.preventDefault();
              onWaitlistClose();
            }}>
              <VStack spacing={4}>
                <Input placeholder="Name" />
                <Input placeholder="Email" type="email" />
                <Textarea placeholder="Message (optional)" />
                <Button type="submit" colorScheme="blue" width="full">
                  Join Waitlist
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={onLoginClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome Back</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={(e) => {
              e.preventDefault();
              onLoginClose();
            }}>
              <VStack spacing={4}>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Password" type="password" />
                <Button type="submit" colorScheme="blue" width="full">
                  Log In
                </Button>
                <Text fontSize="sm" color="gray.600">
                  Don't have an account?{' '}
                  <Link color="blue.500" onClick={() => {
                    onLoginClose();
                    onWaitlistOpen();
                  }}>
                    Join the waitlist
                  </Link>
                </Text>
                <Link color="blue.500" fontSize="sm">
                  Forgot password?
                </Link>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </AnimatedGradient>
  );
};

export default LandingPage; 