import { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import VPIScoreDashboard from '@/components/VPIScoreDashboard';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchVPIScore = async () => {
      try {
        // In a real application, you would get these from user authentication
        const creatorId = 'example-creator';
        const platform = 'instagram';

        const response = await fetch(
          `/api/vpi-score?creatorId=${creatorId}&platform=${platform}`
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setScoreData(data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch VPI Score data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVPIScore();
  }, [toast]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center">
          <Spinner size="xl" />
          <Text>Loading your VPI Score...</Text>
        </VStack>
      </Container>
    );
  }

  if (!scoreData) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center">
          <Heading>Welcome to VPI Score</Heading>
          <Text>Connect your social media accounts to get started</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Your VPI Score Dashboard</Heading>
        <VPIScoreDashboard data={scoreData} />
      </VStack>
    </Container>
  );
} 