package models

import (
	"time"
)

type Url struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Url           string    `gorm:"type:text;not null" json:"url"`
	Status        string    `gorm:"size:20;not null" json:"status"`
	HTMLVersion   string    `gorm:"size:20" json:"html_version"`
	Title         string    `gorm:"size:255" json:"title"`
	H1Count       int       `json:"h1_count"`
	H2Count       int       `json:"h2_count"`
	H3Count       int       `json:"h3_count"`
	H4Count       int       `json:"h4_count"`
	H5Count       int       `json:"h5_count"`
	H6Count       int       `json:"h6_count"`
	InternalLinks int       `json:"internal_links"`
	ExternalLinks int       `json:"external_links"`
	BrokenLinks   int       `json:"broken_links"`
	LoginForm     bool      `json:"login_form"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
