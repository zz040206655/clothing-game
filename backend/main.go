package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
)

// --- Data Models ---

type Character struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	BaseImageURL string `json:"base_image_url"`
}

type ClothingItem struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Type     string `json:"type"`
	ImageURL string `json:"image_url"`
	ZIndex   int    `json:"z_index"`
}

// --- Data ---
// This will be populated dynamically now
var clothingItems []ClothingItem
var characters = []Character{
	{ID: 1, Name: "Alex", BaseImageURL: "/assets/images/characters/alex-base.svg"},
	{ID: 2, Name: "Ben", BaseImageURL: "/assets/images/characters/ben-base.svg"},
	{ID: 3, Name: "Chloe", BaseImageURL: "/assets/images/characters/chloe-base.svg"},
}


// Dynamically loads clothing items from the filesystem
func loadClothingItems() {
	log.Println("Scanning for clothing items...")
	
	basePath := "../frontend/public/assets/images"
	categories := []string{"hair", "tops", "bottoms", "shoes"}
	var idCounter int = 1

	// Default z-index mapping
	zIndexMap := map[string]int{
		"shoes":   5,
		"bottoms": 10,
		"tops":    20,
		"hair":    30,
	}

	for _, category := range categories {
		dirPath := filepath.Join(basePath, category)
		files, err := os.ReadDir(dirPath)
		if err != nil {
			log.Printf("Warning: Could not read directory %s: %v", dirPath, err)
			continue
		}

		for _, file := range files {
			if file.IsDir() {
				continue
			}

			// Generate name from filename (e.g., "blue-shirt.svg" -> "Blue Shirt")
			filename := file.Name()
			ext := filepath.Ext(filename)
			name := strings.TrimSuffix(filename, ext)
			name = strings.ReplaceAll(name, "-", " ")
			name = strings.ReplaceAll(name, "_", " ")
			
			// Capitalize first letter of each word
			runes := []rune(name)
			for i, r := range runes {
				if i == 0 || runes[i-1] == ' ' {
					runes[i] = unicode.ToUpper(r)
				}
			}
			name = string(runes)


			item := ClothingItem{
				ID:       idCounter,
				Name:     name,
				Type:     category,
				ImageURL: filepath.ToSlash(filepath.Join("/assets/images", category, filename)),
				ZIndex:   zIndexMap[category],
			}
			clothingItems = append(clothingItems, item)
			idCounter++
		}
	}
	log.Printf("Successfully loaded %d clothing items.", len(clothingItems))
}


func main() {
	// Load all items from disk on startup
	loadClothingItems()

	router := gin.Default()

	// --- API Routes ---
	api := router.Group("/api/v1")
	{
		api.GET("/clothing-items", func(c *gin.Context) {
			c.JSON(http.StatusOK, clothingItems)
		})

		api.GET("/characters", func(c *gin.Context) {
			c.JSON(http.StatusOK, characters)
		})
	}

	// Start server
	log.Println("Starting server on :8080")
	router.Run(":8080")
}