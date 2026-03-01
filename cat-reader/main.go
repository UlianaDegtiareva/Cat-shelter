package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
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

func sendError(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"message": message})
}

// --- CATS LOGIC ---

func findAllCats(c *gin.Context) {
	breed := c.Query("breed")
	isAdopted := c.Query("isAdopted")
	isKitten := c.Query("isKitten")

	query := `
        SELECT c.id, c.name, c.age, c.breed, c."isAdopted", c.history, c.description, c."adoptionDate",
               u.id as owner_id, u.login as owner_login, u."firstName" as owner_first, u."lastName" as owner_last,
               h.id as health_id, h."medicalStatus", h.notes, h."lastVaccination"
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
		var adoptionDate sql.NullString
		var ownerID, healthID sql.NullInt64
		var ownerLogin, ownerFirst, ownerLast, medicalStatus, notes, lastVaccination sql.NullString

		rows.Scan(&id, &name, &age, &breed, &isAdopted, &history, &description, &adoptionDate,
			&ownerID, &ownerLogin, &ownerFirst, &ownerLast, &healthID, &medicalStatus, &notes, &lastVaccination)

		cat := gin.H{
			"id":           id,
			"name":         name,
			"age":          age,
			"breed":        breed,
			"isAdopted":    isAdopted,
			"history":      history,
			"description":  description,
			"adoptionDate": nil,
			"owner":        nil,
			"healthCard":   nil,
		}

		if adoptionDate.Valid {
			cat["adoptionDate"] = adoptionDate.String
		}
		if ownerID.Valid {
			cat["owner"] = gin.H{"id": ownerID.Int64, "login": ownerLogin.String, "firstName": ownerFirst.String, "lastName": ownerLast.String}
		}
		if healthID.Valid {
			cat["healthCard"] = gin.H{"id": healthID.Int64, "medicalStatus": medicalStatus.String, "notes": notes.String, "lastVaccination": lastVaccination.String}
		}
		cats = append(cats, cat)
	}
	c.JSON(http.StatusOK, cats)
}

func getErrType(status int) string {
	switch status {
	case 400: return "Bad Request"
	case 404: return "Not Found"
	default: return "Internal Server Error"
	}
}

func findOneCat(c *gin.Context) {
	idParam := c.Param("id")
	
	id, err := strconv.Atoi(idParam)
	if err != nil || id <= 0 {
		msg := fmt.Sprintf("Validation failed. ID must be a whole positive integer, but received: %s", idParam)
		c.JSON(http.StatusBadRequest, gin.H{
			"statusCode": 400,
			"message":    msg,
			"error":      "Bad Request",
		})
		return
	}

	query := `
        SELECT c.id, c.name, c.age, c.breed, c."isAdopted", c.history, c.description, c."adoptionDate",
               u.id, u.login, u."firstName", u."lastName",
               h.id, h."medicalStatus", h.notes, h."lastVaccination"
        FROM cats c
        LEFT JOIN users u ON c."ownerId" = u.id
        LEFT JOIN health_cards h ON h."catId" = c.id
        WHERE c.id = $1`

	var catID, age int
	var name, breed, history, description string
	var isAdopted bool
	var adoptionDate sql.NullString
	var uID, hID sql.NullInt64
	var uLogin, uFirst, uLast, hStatus, hNotes, hVaccinated sql.NullString

	// ИСПРАВЛЕНО: используем "=" вместо ":=", так как err объявлена выше через strconv.Atoi
	err = db.QueryRow(query, id).Scan(
		&catID, &name, &age, &breed, &isAdopted, &history, &description, &adoptionDate,
		&uID, &uLogin, &uFirst, &uLast, &hID, &hStatus, &hNotes, &hVaccinated,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			sendError(c, http.StatusNotFound, "Cat not found")
		} else {
			sendError(c, http.StatusInternalServerError, "Database error")
		}
		return
	}

	res := gin.H{
		"id":           catID,
		"name":         name,
		"age":          age,
		"breed":        breed,
		"isAdopted":    isAdopted,
		"history":      history,
		"description":  description,
		"adoptionDate": nil,
		"owner":        nil,
		"healthCard":   nil,
	}

	if adoptionDate.Valid {
		res["adoptionDate"] = adoptionDate.String
	}
	if uID.Valid {
		res["owner"] = gin.H{"id": uID.Int64, "login": uLogin.String, "firstName": uFirst.String, "lastName": uLast.String}
	}
	if hID.Valid {
		res["healthCard"] = gin.H{"id": hID.Int64, "medicalStatus": hStatus.String, "notes": hNotes.String, "lastVaccination": hVaccinated.String}
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

// --- USERS LOGIC ---

func findUserCats(c *gin.Context) {
    id := c.Param("id")
    
    var uID int
    var login, first, last string
    err := db.QueryRow(`SELECT id, login, "firstName", "lastName" FROM users WHERE id = $1`, id).
        Scan(&uID, &login, &first, &last)
    
    if err != nil {
        if err == sql.ErrNoRows {
            sendError(c, http.StatusNotFound, "User not found")
        } else {
            sendError(c, http.StatusInternalServerError, "Database error")
        }
        return
    }

    rows, err := db.Query(`
        SELECT id, name, breed, age, "isAdopted", "adoptionDate" 
        FROM cats 
        WHERE "ownerId" = $1`, id)
    if err != nil {
        sendError(c, http.StatusInternalServerError, "Database error")
        return
    }
    defer rows.Close()

    cats := []gin.H{}
    for rows.Next() {
        var cid, age int
        var name, breed string
        var isAdopted bool
        var adoptionDate sql.NullString
        
        rows.Scan(&cid, &name, &breed, &age, &isAdopted, &adoptionDate)
        
        catObj := gin.H{
            "id":           cid,
            "name":         name,
            "breed":        breed,
            "age":          age,
            "isAdopted":    isAdopted,
            "adoptionDate": nil,
        }
        if adoptionDate.Valid {
            catObj["adoptionDate"] = adoptionDate.String
        }
        cats = append(cats, catObj)
    }

    c.JSON(http.StatusOK, gin.H{
        "id":        uID,
        "login":     login,
        "firstName": first,
        "lastName":  last,
        "cats":      cats,
    })
}

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
		"adoptionRate": rate,
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