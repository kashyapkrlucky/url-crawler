package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/config"
	"github.com/kashyapkrlucky/url-crawler/backend/models"
	"github.com/kashyapkrlucky/url-crawler/backend/services"
)

func AddUrl(c *gin.Context) {
	// Define input that can be either single URL or array of URLs
	var singleInput struct {
		Url string `json:"url" binding:"required,url"`
	}

	var batchInput struct {
		Urls []string `json:"urls" binding:"required,dive,url"`
	}

	if err := c.ShouldBindJSON(&batchInput); err == nil {
		// Batch mode
		var urls []models.Url
		for _, u := range batchInput.Urls {
			urls = append(urls, models.Url{Url: u, Status: "queued"})
		}
		if err := config.DB.Create(&urls).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"count": len(urls), "urls": urls})
		return
	}

	// If batch parse failed, try single url
	if err := c.ShouldBindJSON(&singleInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	url := models.Url{
		Url:    singleInput.Url,
		Status: "queued",
	}

	if err := config.DB.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, url)
}

func GetUrls(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")

	var (
		urls     []models.Url
		total    int64
		pageInt  = 1
		limitInt = 10
	)

	// Convert query params
	fmt.Sscanf(page, "%d", &pageInt)
	fmt.Sscanf(limit, "%d", &limitInt)

	offset := (pageInt - 1) * limitInt

	// Count total
	config.DB.Model(&models.Url{}).Count(&total)

	// Get records
	if err := config.DB.
		Limit(limitInt).
		Offset(offset).
		Order("created_at DESC").
		Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"page":    pageInt,
		"limit":   limitInt,
		"total":   total,
		"urls":    urls,
		"hasNext": int64(offset+limitInt) < total,
		"hasPrev": pageInt > 1,
	})
}

func StartCrawl(c *gin.Context) {
	id := c.Param("id")
	var url models.Url

	if err := config.DB.First(&url, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	url.Status = "processing"
	config.DB.Save(&url)

	if err := services.CrawlURL(&url); err != nil {
		url.Status = "error"
		config.DB.Save(&url)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, url)
}

func StopCrawl(c *gin.Context) {
	id := c.Param("id")

	var url models.Url
	if err := config.DB.First(&url, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	url.Status = "stopped"
	if err := config.DB.Save(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Crawl stopped", "url": url})
}
