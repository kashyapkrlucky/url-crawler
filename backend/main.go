package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/config"
	"github.com/kashyapkrlucky/url-crawler/backend/routes"
)

func main() {
	config.ConnectDB()

	router := gin.Default()
	routes.RegisterRoutes(router)

	router.Run(":8080")
}
