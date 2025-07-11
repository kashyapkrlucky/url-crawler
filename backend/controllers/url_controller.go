package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kashyapkrlucky/url-crawler/backend/config"
	"github.com/kashyapkrlucky/url-crawler/backend/models"
	"github.com/kashyapkrlucky/url-crawler/backend/services"
	"gorm.io/gorm"
)

func AddUrl(c *gin.Context) {
	var raw map[string]interface{}
	if err := c.ShouldBindJSON(&raw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON: " + err.Error()})
		return
	}

	// Handle batch mode
	if urlsRaw, exists := raw["urls"]; exists {
		urlsSlice, ok := urlsRaw.([]interface{})
		if !ok || len(urlsSlice) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or empty 'urls' array"})
			return
		}

		var urls []models.Url
		for _, u := range urlsSlice {
			if str, ok := u.(string); ok {
				urls = append(urls, models.Url{Url: str, Status: "queued"})
			}
		}

		if len(urls) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No valid URLs found"})
			return
		}

		if err := config.DB.Create(&urls).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"count": len(urls), "urls": urls})
		return
	}

	// Handle single mode
	if urlRaw, exists := raw["url"]; exists {
		urlStr, ok := urlRaw.(string)
		if !ok || urlStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'url'"})
			return
		}

		url := models.Url{
			Url:    urlStr,
			Status: "queued",
		}
		if err := config.DB.Create(&url).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, url)
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"error": "No 'url' or 'urls' field found"})
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

func GetUrlById(c *gin.Context) {
	id := c.Param("id")

	var url models.Url

	if err := config.DB.First(&url, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, url)
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
