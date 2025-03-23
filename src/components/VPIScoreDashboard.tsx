import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VPIScoreData {
  totalScore: number;
  engagementScore: number;
  reachScore: number;
  monetizationScore: number;
  authenticityScore: number;
  metrics: {
    followers: number;
    engagementRate: number;
    averageViews: number;
    revenue: number;
    brandDeals: number;
  };
}

interface VPIScoreDashboardProps {
  data: VPIScoreData;
}

const VPIScoreDashboard: React.FC<VPIScoreDashboardProps> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const chartData = {
    labels: ['Engagement', 'Reach', 'Monetization', 'Authenticity'],
    datasets: [
      {
        label: 'Score Components',
        data: [
          data.engagementScore,
          data.reachScore,
          data.monetizationScore,
          data.authenticityScore,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'VPI Score Components',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Grid templateColumns="repeat(1, 1fr)" gap={6}>
        {/* Main Score */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            VPI Score
          </Heading>
          <Progress
            value={data.totalScore}
            size="lg"
            colorScheme="blue"
            borderRadius="full"
            mb={4}
          />
          <Text fontSize="4xl" fontWeight="bold" color="blue.500">
            {data.totalScore.toFixed(1)}
          </Text>
        </Box>

        {/* Score Components */}
        <Box>
          <Line data={chartData} options={chartOptions} />
        </Box>

        {/* Metrics Grid */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Followers</StatLabel>
            <StatNumber>{data.metrics.followers.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Engagement Rate: {data.metrics.engagementRate.toFixed(2)}%
            </StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Average Views</StatLabel>
            <StatNumber>{data.metrics.averageViews.toLocaleString()}</StatNumber>
            <StatHelpText>Per Post</StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Revenue</StatLabel>
            <StatNumber>${data.metrics.revenue.toLocaleString()}</StatNumber>
            <StatHelpText>Monthly</StatHelpText>
          </Stat>

          <Stat
            p={4}
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel>Brand Deals</StatLabel>
            <StatNumber>{data.metrics.brandDeals}</StatNumber>
            <StatHelpText>Active Partnerships</StatHelpText>
          </Stat>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VPIScoreDashboard; 