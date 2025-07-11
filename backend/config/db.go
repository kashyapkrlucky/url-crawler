package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/kashyapkrlucky/url-crawler/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	if os.Getenv("RUNNING_IN_DOCKER") != "true" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	var database *gorm.DB
	var err error
	for i := 0; i < 10; i++ {
		database, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Println("Waiting for DB connection...")
		time.Sleep(3 * time.Second)
	}
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}

	DB = database
	fmt.Println("=> Database connected")

	err = database.AutoMigrate(&models.User{}, &models.Url{})
	if err != nil {
		log.Fatalf("Failed to migrate DB: %v", err)
	}

	SeedGuestUser()
}

func SeedGuestUser() {
	var guest models.User
	err := DB.Where("email = ?", "guest@urlcrawler.com").First(&guest).Error
	if err != nil {
		guest = models.User{
			Name:     "Guest User",
			Email:    "guest@urlcrawler.com",
			Password: "welcome",
		}
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(guest.Password), bcrypt.DefaultCost)
		guest.Password = string(hashedPassword)
		if err := DB.Create(&guest).Error; err != nil {
			log.Fatalf("Failed to create guest user: %v", err)
		}
		fmt.Println("=> Guest user created")
	}
}
