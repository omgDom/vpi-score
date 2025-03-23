package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/vpi-score/score-service/internal/database"
	"github.com/vpi-score/score-service/internal/handlers"
	"github.com/vpi-score/score-service/internal/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create Gin router
	r := gin.Default()

	// Add middleware
	r.Use(middleware.CORS())
	r.Use(middleware.Auth())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		sqlDB, err := db.DB()
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status": "unhealthy",
				"error":  err.Error(),
			})
			return
		}

		if err := sqlDB.Ping(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status": "unhealthy",
				"error":  err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "healthy",
			"database": "connected",
		})
	})

	// Initialize handlers
	h := handlers.NewHandler(db)

	// Routes
	api := r.Group("/api/v1")
	{
		// Score routes
		api.POST("/scores", h.CreateScore)
		api.GET("/scores/:creatorId", h.GetScore)
		api.PUT("/scores/:creatorId", h.UpdateScore)
		api.DELETE("/scores/:creatorId", h.DeleteScore)

		// Metrics routes
		api.GET("/metrics/:creatorId", h.GetMetrics)
		api.POST("/metrics/:creatorId", h.UpdateMetrics)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
} 