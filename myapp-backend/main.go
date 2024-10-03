package main

import (
	"database/sql"
	"fmt"
	"log"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

type WorkData struct {
	ID              string `json:"id"`
	WorkName        string `json:"workName"`
	WorkDescription string `json:"workDescription"`
	Machine         string `json:"machine"`
	Operator        string `json:"operator"`
	Quantity        string `json:"quantity"`
	Start           string `json:"start"`
	End             string `json:"end"`
	Urgency         string `json:"urgency"`
	Status          string `json:"status"`
}

type MachineData struct {
	ID          string `json:"id"`
	MachineName string `json:"machineName"`
	MachineDesc string `json:"machineDescription"`
}

type userData struct {
	ID        string `json:"id"`
	UserName  string `json:"userName"`
	Position  string `json:"position"`
	AccessLvl string `json:"accessLvl"`
	Password  string `json:"password"`
}

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/testDB")

	if err != nil {
		log.Fatal(err) // Use log.Fatal to terminate if the connection fails

	}
	if err = db.Ping(); err != nil {
		log.Fatal(err) // Check if we can ping the database
	}
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Change this if your frontend runs on a different port
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/add-job", addJob)
	r.POST("/add-machine", addMachine)
	r.POST("/add-user", addUser)
	r.DELETE("/delete-job/:id", deleteJob)
	r.DELETE("/delete-machine/:id", deleteMachine)
	r.DELETE("/delete-user/:id", deleteUser)
	r.GET("/jobs", getJobs)
	r.GET("/machine", getMachine)
	r.GET("/user", getUser)
	r.GET("/operator", getOperator)
	r.Run(":8080")
}

func addJob(c *gin.Context) {
	var job WorkData
	if err := c.ShouldBindJSON(&job); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	fmt.Println("Job to be added:", job)

	result, err := db.Exec("INSERT INTO jobs (workName, workDescription, machine, operator, quantity, start, end, urgency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		job.WorkName, job.WorkDescription, job.Machine, job.Operator, job.Quantity, job.Start, job.End, job.Urgency, job.Status)

	if err != nil {
		fmt.Println("Error executing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add job", "details": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	idStr := fmt.Sprintf("%v", id)
	job.ID = idStr

	c.JSON(http.StatusOK, job)
}
func addMachine(c *gin.Context) {
	var machine MachineData
	if err := c.ShouldBindJSON(&machine); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	fmt.Println("Machine to be added:", machine)

	result, err := db.Exec("INSERT INTO machines (machineName, machineDescription) VALUES (?, ?)",
		machine.MachineName, machine.MachineDesc)

	if err != nil {
		fmt.Println("Error executing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add job", "details": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	idStr := fmt.Sprintf("%v", id)
	machine.ID = idStr

	c.JSON(http.StatusOK, machine)
}

func addUser(c *gin.Context) {
	var user userData
	if err := c.ShouldBindJSON(&user); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	fmt.Println("User to be added:", user)

	result, err := db.Exec("INSERT INTO Users (userName, position, accessLvl, password) VALUES (?, ?, ?, ?)",
		user.UserName, user.Position, user.AccessLvl, user.Password)

	if err != nil {
		fmt.Println("Error executing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add job", "details": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	idStr := fmt.Sprintf("%v", id)
	user.ID = idStr

	c.JSON(http.StatusOK, user)
}

func deleteJob(c *gin.Context) {
	id := c.Param("id") // Change to use ID
	_, err := db.Exec("DELETE FROM jobs WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Job deleted"})
}
func deleteMachine(c *gin.Context) {
	id := c.Param("id") // Change to use ID
	_, err := db.Exec("DELETE FROM machines WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "machine deleted"})
}
func deleteUser(c *gin.Context) {
	id := c.Param("id") // Change to use ID
	_, err := db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user deleted"})
}

func getJobs(c *gin.Context) {
	fmt.Println("Fetching jobs...")

	rows, err := db.Query("SELECT id, workName, workDescription, machine, operator, quantity, start, end, urgency, status FROM jobs")
	if err != nil {
		fmt.Println("Error querying jobs:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query jobs", "details": err.Error()})
		return
	}
	defer rows.Close()

	var jobs []WorkData
	for rows.Next() {
		var job WorkData
		if err := rows.Scan(&job.ID, &job.WorkName, &job.WorkDescription, &job.Machine, &job.Operator, &job.Quantity, &job.Start, &job.End, &job.Urgency, &job.Status); err != nil {
			fmt.Println("Error scanning job:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan job", "details": err.Error()})
			return
		}
		jobs = append(jobs, job)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error iterating rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating rows", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func getMachine(c *gin.Context) {
	fmt.Println("Fetching machines...")

	rows, err := db.Query("SELECT id, machineName, machineDescription FROM machines")
	if err != nil {
		fmt.Println("Error querying machine:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query machines", "details": err.Error()})
		return
	}
	defer rows.Close()

	var machines []MachineData
	for rows.Next() {
		var machine MachineData
		if err := rows.Scan(&machine.ID, &machine.MachineName, &machine.MachineDesc); err != nil {
			fmt.Println("Error scanning machine:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan machines", "details": err.Error()})
			return
		}
		machines = append(machines, machine)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error iterating rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating rows", "details": err.Error()})
		return
	}
	fmt.Println("Number of machines fetched:", len(machines))

	c.JSON(http.StatusOK, machines)
}

func getUser(c *gin.Context) {
	fmt.Println("Fetching users...")

	rows, err := db.Query("SELECT id, userName, position, accesslvl, password FROM users")
	if err != nil {
		fmt.Println("Error querying users:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query users", "details": err.Error()})
		return
	}
	defer rows.Close()

	var users []userData
	for rows.Next() {
		var user userData
		if err := rows.Scan(&user.ID, &user.UserName, &user.Position, &user.AccessLvl, &user.Password); err != nil {
			fmt.Println("Error scanning machine:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan users", "details": err.Error()})
			return
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error iterating rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating rows", "details": err.Error()})
		return
	}
	fmt.Println("Number of users fetched:", len(users))

	c.JSON(http.StatusOK, users)
}

func getOperator(c *gin.Context) {
	fmt.Println("Fetching users...")

	rows, err := db.Query("SELECT id, userName, position FROM users WHERE position = 'Operator'")
	if err != nil {
		fmt.Println("Error querying users:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query users", "details": err.Error()})
		return
	}
	defer rows.Close()

	var users []userData
	for rows.Next() {
		var user userData
		if err := rows.Scan(&user.ID, &user.UserName, &user.Position); err != nil {
			fmt.Println("Error scanning machine:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan users", "details": err.Error()})
			return
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error iterating rows:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating rows", "details": err.Error()})
		return
	}
	fmt.Println("Number of users fetched:", len(users))

	c.JSON(http.StatusOK, users)
}
