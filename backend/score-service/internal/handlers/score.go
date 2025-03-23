package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vpi-score/score-service/internal/database"
	"github.com/vpi-score/score-service/internal/models"
	"gorm.io/gorm"
)

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{db: db}
}

// CreateScore creates a new score for a creator
func (h *Handler) CreateScore(c *gin.Context) {
	var score models.Score
	if err := c.ShouldBindJSON(&score); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	score.CalculateScores()

	if err := h.db.Create(&score).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, score)
}

// GetScore retrieves a score for a creator
func (h *Handler) GetScore(c *gin.Context) {
	creatorID := c.Param("creatorId")
	var score models.Score

	if err := h.db.Where("creator_id = ?", creatorID).First(&score).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Score not found"})
		return
	}

	c.JSON(http.StatusOK, score)
}

// UpdateScore updates a score for a creator
func (h *Handler) UpdateScore(c *gin.Context) {
	creatorID := c.Param("creatorId")
	var score models.Score

	if err := h.db.Where("creator_id = ?", creatorID).First(&score).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Score not found"})
		return
	}

	if err := c.ShouldBindJSON(&score); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	score.CalculateScores()

	if err := h.db.Save(&score).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, score)
}

// DeleteScore deletes a score for a creator
func (h *Handler) DeleteScore(c *gin.Context) {
	creatorID := c.Param("creatorId")

	if err := h.db.Where("creator_id = ?", creatorID).Delete(&models.Score{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score deleted successfully"})
}

// GetMetrics retrieves metrics for a creator
func (h *Handler) GetMetrics(c *gin.Context) {
	creatorID := c.Param("creatorId")
	var score models.Score

	if err := h.db.Where("creator_id = ?", creatorID).First(&score).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Metrics not found"})
		return
	}

	c.JSON(http.StatusOK, score.Metrics)
}

// UpdateMetrics updates metrics for a creator
func (h *Handler) UpdateMetrics(c *gin.Context) {
	creatorID := c.Param("creatorId")
	var score models.Score
	var metrics models.Metrics

	if err := h.db.Where("creator_id = ?", creatorID).First(&score).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Score not found"})
		return
	}

	if err := c.ShouldBindJSON(&metrics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	score.Metrics = metrics
	score.CalculateScores()

	if err := h.db.Save(&score).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, score)
} 