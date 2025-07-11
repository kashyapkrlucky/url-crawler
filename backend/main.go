package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/config"
	"github.com/kashyapkrlucky/url-crawler/backend/middleware"
	"github.com/kashyapkrlucky/url-crawler/backend/routes"
)

func main() {
	config.ConnectDB()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/register", routes.Register)
	router.POST("/login", routes.Login)
	router.POST("/guest-login", routes.GuestLogin)

	api := router.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		routes.RegisterRoutes(api)
	}

	router.Run(":8080")
}
