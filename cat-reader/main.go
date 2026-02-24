package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	connStr := "host=db user=user password=password dbname=shelter port=5432 sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	// Маршруты совпадают с вызовами из NestJS
	r.GET("/cats", findAllCats)
	r.GET("/cats/:id", findOneCat)
	r.GET("/users", findAllUsers)
	r.GET("/users/:id", findOneUser)
	r.GET("/users/:id/cats", findUserCats)
	r.GET("/stats/summary", getGeneralSummary)
	r.GET("/stats/breeds", getBreedDistribution)
	r.GET("/stats/top-adopters", getTopAdopters)

	log.Println("High-performance Reader Service started on :8080")
	r.Run(":8080")
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ОШИБОК ---

func sendError(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"message": message})
}

// --- CATS LOGIC ---

func findAllCats(c *gin.Context) {
	breed := c.Query("breed")
	isAdopted := c.Query("isAdopted")
	isKitten := c.Query("isKitten")

	query := `
        SELECT c.id, c.name, c.age, c.breed, c."isAdopted", c.history, c.description,
               u.id as owner_id, u."firstName" as owner_name,
               h.id as health_id, h."medicalStatus"
        FROM cats c
        LEFT JOIN users u ON c."ownerId" = u.id
        LEFT JOIN health_cards h ON h."catId" = c.id
        WHERE 1=1`

	var args []interface{}
	argID := 1

	if breed != "" {
		query += fmt.Sprintf(" AND c.breed = $%d", argID)
		args = append(args, breed)
		argID++
	}
	if isAdopted != "" {
		query += fmt.Sprintf(" AND c.\"isAdopted\" = $%d", argID)
		args = append(args, isAdopted == "true")
		argID++
	}
	if isKitten == "true" {
		query += " AND c.age < 1"
	}

	rows, err := db.Query(query, args...)
	if err != nil {
		sendError(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	cats := []gin.H{}
	for rows.Next() {
		var id, age int
		var name, breed, history, description string
		var isAdopted bool
		var ownerID, healthID sql.NullInt64
		var ownerName, medicalStatus sql.NullString

		rows.Scan(&id, &name, &age, &breed, &isAdopted, &history, &description, &ownerID, &ownerName, &healthID, &medicalStatus)

		cat := gin.H{
			"id":          id,
			"name":        name,
			"age":         age,
			"breed":       breed,
			"isAdopted":   isAdopted,
			"history":     history,
			"description": description,
		}
		if ownerID.Valid {
			cat["owner"] = gin.H{"id": ownerID.Int64, "firstName": ownerName.String}
		}
		if healthID.Valid {
			cat["healthCard"] = gin.H{"id": healthID.Int64, "medicalStatus": medicalStatus.String}
		}
		cats = append(cats, cat)
	}
	c.JSON(http.StatusOK, cats)
}

func findOneCat(c *gin.Context) {
	id := c.Param("id")
	query := `
        SELECT c.id, c.name, c.age, c.breed, c."isAdopted", 
               u.id, u."firstName", u."lastName",
               h.id, h."medicalStatus", h.notes
        FROM cats c
        LEFT JOIN users u ON c."ownerId" = u.id
        LEFT JOIN health_cards h ON h."catId" = c.id
        WHERE c.id = $1`

	var catID, age int
	var name, breed string
	var isAdopted bool
	var uID, hID sql.NullInt64
	var uFirst, uLast, hStatus, hNotes sql.NullString

	err := db.QueryRow(query, id).Scan(&catID, &name, &age, &breed, &isAdopted, &uID, &uFirst, &uLast, &hID, &hStatus, &hNotes)
	if err != nil {
		if err == sql.ErrNoRows {
			sendError(c, http.StatusNotFound, "Cat not found")
		} else {
			sendError(c, http.StatusBadRequest, "Invalid ID format")
		}
		return
	}

	res := gin.H{
		"id":        catID,
		"name":      name,
		"age":       age,
		"breed":     breed,
		"isAdopted": isAdopted,
	}
	if uID.Valid {
		res["owner"] = gin.H{"id": uID.Int64, "firstName": uFirst.String, "lastName": uLast.String}
	}
	if hID.Valid {
		res["healthCard"] = gin.H{"id": hID.Int64, "medicalStatus": hStatus.String, "notes": hNotes.String}
	}

	c.JSON(http.StatusOK, res)
}

// --- USERS LOGIC ---

func findAllUsers(c *gin.Context) {
	rows, err := db.Query(`SELECT id, login, "firstName", "lastName" FROM users`)
	if err != nil {
		sendError(c, http.StatusInternalServerError, "Could not fetch users")
		return
	}
	defer rows.Close()

	users := []gin.H{}
	for rows.Next() {
		var id int
		var login, first, last string
		rows.Scan(&id, &login, &first, &last)
		users = append(users, gin.H{"id": id, "login": login, "firstName": first, "lastName": last})
	}
	c.JSON(http.StatusOK, users)
}

func findOneUser(c *gin.Context) {
	id := c.Param("id")
	var uID int
	var login, first, last string
	err := db.QueryRow(`SELECT id, login, "firstName", "lastName" FROM users WHERE id = $1`, id).Scan(&uID, &login, &first, &last)
	
	if err != nil {
		if err == sql.ErrNoRows {
			sendError(c, http.StatusNotFound, "User not found")
		} else {
			sendError(c, http.StatusBadRequest, "Invalid User ID")
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": uID, "login": login, "firstName": first, "lastName": last})
}

func findUserCats(c *gin.Context) {
	id := c.Param("id")
	
	// Сначала проверим, существует ли юзер
	var exists int
	db.QueryRow("SELECT 1 FROM users WHERE id = $1", id).Scan(&exists)
	if exists == 0 {
		sendError(c, http.StatusNotFound, "User not found")
		return
	}

	rows, err := db.Query(`SELECT id, name, breed FROM cats WHERE "ownerId" = $1`, id)
	if err != nil {
		sendError(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	cats := []gin.H{}
	for rows.Next() {
		var cid int
		var name, breed string
		rows.Scan(&cid, &name, &breed)
		cats = append(cats, gin.H{"id": cid, "name": name, "breed": breed})
	}
	c.JSON(http.StatusOK, cats)
}

// --- STATS LOGIC ---

func getGeneralSummary(c *gin.Context) {
	var total, adopted int
	db.QueryRow("SELECT count(*) FROM cats").Scan(&total)
	db.QueryRow("SELECT count(*) FROM cats WHERE \"isAdopted\" = true").Scan(&adopted)

	rate := 0.0
	if total > 0 {
		rate = float64(adopted) / float64(total) * 100
	}
	c.JSON(http.StatusOK, gin.H{
		"totalAnimals": total,
		"adoptedCount": adopted,
		"adoptionRate": fmt.Sprintf("%.2f", rate),
	})
}

func getBreedDistribution(c *gin.Context) {
	rows, err := db.Query(`SELECT breed, COUNT(id) as count FROM cats GROUP BY breed ORDER BY count DESC`)
	if err != nil {
		sendError(c, http.StatusInternalServerError, "Stats error")
		return
	}
	defer rows.Close()

	stats := []gin.H{}
	for rows.Next() {
		var breed string
		var count int
		rows.Scan(&breed, &count)
		stats = append(stats, gin.H{"breed": breed, "count": count})
	}
	c.JSON(http.StatusOK, stats)
}

func getTopAdopters(c *gin.Context) {
	rows, err := db.Query(`
        SELECT u.id, u."firstName", u."lastName", COUNT(c.id) as count 
        FROM users u 
        INNER JOIN cats c ON c."ownerId" = u.id 
        GROUP BY u.id 
        ORDER BY count DESC LIMIT 5`)
	if err != nil {
		sendError(c, http.StatusInternalServerError, "Stats error")
		return
	}
	defer rows.Close()

	adopters := []gin.H{}
	for rows.Next() {
		var id, count int
		var first, last string
		rows.Scan(&id, &first, &last, &count)
		adopters = append(adopters, gin.H{
			"id": id, "firstName": first, "lastName": last, "count": count,
		})
	}
	c.JSON(http.StatusOK, adopters)
}