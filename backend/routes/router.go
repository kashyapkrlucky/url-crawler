package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/controllers"
)

func Register(c *gin.Context) {
	controllers.Register(c)
}

func Login(c *gin.Context) {
	controllers.Login(c)
}

func GuestLogin(c *gin.Context) {
	controllers.GuestLogin(c)
}

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "UP",
		})
	})

	api := r.Group("/")
	{
		api.POST("/add-url", controllers.AddUrl)
		api.GET("/urls", controllers.GetUrls)
		api.GET("/url/:id", controllers.GetUrlById)

		api.POST("/start-crawl/:id", controllers.StartCrawl)
		api.POST("/stop-crawl/:id", controllers.StopCrawl)
	}
}
