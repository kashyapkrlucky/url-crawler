package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/controllers"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "UP",
		})
	})

	api := r.Group("/api")
	{
		api.POST("/add-url", controllers.AddUrl)
		api.GET("/urls", controllers.GetUrls)
		api.POST("/start-crawl/:id", controllers.StartCrawl)
		api.POST("/stop-crawl/:id", controllers.StopCrawl)
	}
}
