import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import VPIScore from '@/models/VPIScore';
import { z } from 'zod';

// Input validation schema
const VPIScoreInputSchema = z.object({
  creatorId: z.string(),
  platform: z.string(),
  metrics: z.object({
    followers: z.number().min(0),
    engagementRate: z.number().min(0),
    averageViews: z.number().min(0),
    revenue: z.number().min(0),
    brandDeals: z.number().min(0)
  })
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        // Validate input data
        const validatedData = VPIScoreInputSchema.parse(req.body);

        // Find existing score or create new one
        let vpiScore = await VPIScore.findOne({
          creatorId: validatedData.creatorId,
          platform: validatedData.platform
        });

        if (!vpiScore) {
          vpiScore = new VPIScore(validatedData);
        } else {
          vpiScore.metrics = validatedData.metrics;
        }

        // Save and recalculate scores
        await vpiScore.save();

        return res.status(200).json({
          success: true,
          data: vpiScore
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid input data',
            details: error.errors
          });
        }
        return res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }

    case 'GET':
      try {
        const { creatorId, platform } = req.query;

        if (!creatorId || !platform) {
          return res.status(400).json({
            success: false,
            error: 'Missing required parameters'
          });
        }

        const vpiScore = await VPIScore.findOne({
          creatorId,
          platform
        });

        if (!vpiScore) {
          return res.status(404).json({
            success: false,
            error: 'VPI Score not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: vpiScore
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
  }
} 