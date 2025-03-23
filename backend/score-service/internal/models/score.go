package models

import (
	"time"

	"gorm.io/gorm"
)

type Metrics struct {
	Followers      int64   `json:"followers"`
	EngagementRate float64 `json:"engagementRate"`
	AverageViews   int64   `json:"averageViews"`
	Revenue        float64 `json:"revenue"`
	BrandDeals     int     `json:"brandDeals"`
}

type Score struct {
	gorm.Model
	CreatorID         string    `json:"creatorId" gorm:"uniqueIndex"`
	Platform          string    `json:"platform"`
	EngagementScore   float64   `json:"engagementScore"`
	ReachScore        float64   `json:"reachScore"`
	MonetizationScore float64   `json:"monetizationScore"`
	AuthenticityScore float64   `json:"authenticityScore"`
	TotalScore        float64   `json:"totalScore"`
	LastUpdated       time.Time `json:"lastUpdated"`
	Metrics           Metrics   `json:"metrics" gorm:"embedded"`
}

// CalculateScores updates all component scores and total score
func (s *Score) CalculateScores() {
	// Calculate Engagement Score
	s.EngagementScore = s.calculateEngagementScore()

	// Calculate Reach Score
	s.ReachScore = s.calculateReachScore()

	// Calculate Monetization Score
	s.MonetizationScore = s.calculateMonetizationScore()

	// Calculate Authenticity Score
	s.AuthenticityScore = s.calculateAuthenticityScore()

	// Calculate Total Score
	s.TotalScore = s.calculateTotalScore()

	// Update timestamp
	s.LastUpdated = time.Now()
}

func (s *Score) calculateEngagementScore() float64 {
	const (
		engagementWeight = 0.4
		followerWeight   = 0.6
	)

	normalizedEngagement := min(s.Metrics.EngagementRate*100, 100)
	normalizedFollowers := min(float64(s.Metrics.Followers)/1000000*100, 100)

	return normalizedEngagement*engagementWeight + normalizedFollowers*followerWeight
}

func (s *Score) calculateReachScore() float64 {
	const (
		followerWeight = 0.5
		viewWeight     = 0.5
	)

	normalizedFollowers := min(float64(s.Metrics.Followers)/1000000*100, 100)
	normalizedViews := min(float64(s.Metrics.AverageViews)/100000*100, 100)

	return normalizedFollowers*followerWeight + normalizedViews*viewWeight
}

func (s *Score) calculateMonetizationScore() float64 {
	const (
		revenueWeight    = 0.7
		brandDealWeight  = 0.3
	)

	normalizedRevenue := min(s.Metrics.Revenue/10000*100, 100)
	normalizedBrandDeals := min(float64(s.Metrics.BrandDeals)*10, 100)

	return normalizedRevenue*revenueWeight + normalizedBrandDeals*brandDealWeight
}

func (s *Score) calculateAuthenticityScore() float64 {
	// This is a placeholder for more complex authenticity calculation
	// In a real implementation, this would consider factors like:
	// - Content originality
	// - Audience sentiment
	// - Brand alignment
	// - Engagement quality
	return 75.0
}

func (s *Score) calculateTotalScore() float64 {
	const (
		engagementWeight   = 0.3
		reachWeight        = 0.25
		monetizationWeight = 0.25
		authenticityWeight = 0.2
	)

	return s.EngagementScore*engagementWeight +
		s.ReachScore*reachWeight +
		s.MonetizationScore*monetizationWeight +
		s.AuthenticityScore*authenticityWeight
} 