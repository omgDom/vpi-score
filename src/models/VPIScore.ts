import mongoose, { Schema, Document } from 'mongoose';

export interface IVPIScore extends Document {
  creatorId: string;
  platform: string;
  engagementScore: number;
  reachScore: number;
  monetizationScore: number;
  authenticityScore: number;
  totalScore: number;
  lastUpdated: Date;
  metrics: {
    followers: number;
    engagementRate: number;
    averageViews: number;
    revenue: number;
    brandDeals: number;
  };
}

const VPIScoreSchema = new Schema({
  creatorId: { type: String, required: true },
  platform: { type: String, required: true },
  engagementScore: { type: Number, required: true },
  reachScore: { type: Number, required: true },
  monetizationScore: { type: Number, required: true },
  authenticityScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  metrics: {
    followers: { type: Number, required: true },
    engagementRate: { type: Number, required: true },
    averageViews: { type: Number, required: true },
    revenue: { type: Number, required: true },
    brandDeals: { type: Number, required: true }
  }
});

// Calculate individual scores
VPIScoreSchema.methods.calculateEngagementScore = function(metrics: any): number {
  const { engagementRate, followers } = metrics;
  const engagementWeight = 0.4;
  const followerWeight = 0.6;
  
  const normalizedEngagement = Math.min(engagementRate * 100, 100);
  const normalizedFollowers = Math.min(Math.log10(followers) * 10, 100);
  
  return (normalizedEngagement * engagementWeight + normalizedFollowers * followerWeight);
};

VPIScoreSchema.methods.calculateReachScore = function(metrics: any): number {
  const { followers, averageViews } = metrics;
  const followerWeight = 0.5;
  const viewWeight = 0.5;
  
  const normalizedFollowers = Math.min(Math.log10(followers) * 10, 100);
  const normalizedViews = Math.min(Math.log10(averageViews) * 10, 100);
  
  return (normalizedFollowers * followerWeight + normalizedViews * viewWeight);
};

VPIScoreSchema.methods.calculateMonetizationScore = function(metrics: any): number {
  const { revenue, brandDeals } = metrics;
  const revenueWeight = 0.7;
  const brandDealWeight = 0.3;
  
  const normalizedRevenue = Math.min(Math.log10(revenue) * 10, 100);
  const normalizedBrandDeals = Math.min(brandDeals * 10, 100);
  
  return (normalizedRevenue * revenueWeight + normalizedBrandDeals * brandDealWeight);
};

VPIScoreSchema.methods.calculateAuthenticityScore = function(metrics: any): number {
  // This is a placeholder for more complex authenticity calculation
  // In a real implementation, this would consider factors like:
  // - Content originality
  // - Audience sentiment
  // - Brand alignment
  // - Engagement quality
  return 75; // Default score
};

// Calculate total VPI Score
VPIScoreSchema.methods.calculateTotalScore = function(): number {
  const weights = {
    engagement: 0.3,
    reach: 0.25,
    monetization: 0.25,
    authenticity: 0.2
  };
  
  return (
    this.engagementScore * weights.engagement +
    this.reachScore * weights.reach +
    this.monetizationScore * weights.monetization +
    this.authenticityScore * weights.authenticity
  );
};

// Pre-save middleware to update scores
VPIScoreSchema.pre('save', function(next) {
  this.engagementScore = this.calculateEngagementScore(this.metrics);
  this.reachScore = this.calculateReachScore(this.metrics);
  this.monetizationScore = this.calculateMonetizationScore(this.metrics);
  this.authenticityScore = this.calculateAuthenticityScore(this.metrics);
  this.totalScore = this.calculateTotalScore();
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model<IVPIScore>('VPIScore', VPIScoreSchema); 