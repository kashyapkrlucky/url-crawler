package services

import (
	"errors"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/kashyapkrlucky/url-crawler/backend/config"
	"github.com/kashyapkrlucky/url-crawler/backend/models"
	"golang.org/x/net/html"
)

func CrawlURL(urlEntry *models.Url) error {
	resp, err := http.Get(urlEntry.Url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return errors.New("non-200 response received")
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return err
	}

	// Title
	urlEntry.Title = strings.TrimSpace(doc.Find("title").First().Text())

	// Headings count
	urlEntry.H1Count = doc.Find("h1").Length()
	urlEntry.H2Count = doc.Find("h2").Length()
	urlEntry.H3Count = doc.Find("h3").Length()
	urlEntry.H4Count = doc.Find("h4").Length()
	urlEntry.H5Count = doc.Find("h5").Length()
	urlEntry.H6Count = doc.Find("h6").Length()

	urlEntry.HTMLVersion = detectHTMLVersionFromDoc(doc)

	// Links
	internalLinks, externalLinks := countLinks(doc, urlEntry.Url)
	urlEntry.InternalLinks = internalLinks
	urlEntry.ExternalLinks = externalLinks

	// Detect login form
	urlEntry.LoginForm = doc.Find("input[type='password']").Length() > 0

	// Update status
	urlEntry.Status = "completed"

	// Save updates
	return config.DB.Save(urlEntry).Error
}

func detectHTMLVersionFromDoc(doc *goquery.Document) string {
	for _, node := range doc.Nodes {
		for c := node.FirstChild; c != nil; c = c.NextSibling {
			if c.Type == html.DoctypeNode {
				if strings.ToLower(c.Data) == "html" {
					return "HTML5"
				}
			}
		}
	}
	return "Older versions"
}

func countLinks(doc *goquery.Document, baseURL string) (int, int) {
	internal := 0
	external := 0

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, _ := s.Attr("href")
		if strings.HasPrefix(href, "/") || strings.Contains(href, baseURL) {
			internal++
		} else if strings.HasPrefix(href, "http") {
			external++
		}
	})
	return internal, external
}
