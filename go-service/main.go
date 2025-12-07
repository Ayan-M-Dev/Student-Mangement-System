package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/jung-kurt/gofpdf"
)

type Student struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	RoleID       int    `json:"roleId"`
	Gender       string `json:"gender"`
	Phone        string `json:"phone"`
	Address      string `json:"currentAddress"`
	FatherName   string `json:"fatherName"`
	MotherName   string `json:"motherName"`
	StartYear    string `json:"admissionDt"`
	ClassName    string `json:"className"`
    SectionName  string `json:"sectionName"`
    Roll         int    `json:"roll"`
}

type StandardResponse struct {
    Data Student `json:"data"`
} 

func generatePDF(student Student) *gofpdf.Fpdf {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "Student Report Card")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 12)
    
    addLine := func(label, value string) {
        pdf.SetFont("Arial", "B", 12)
        pdf.Cell(50, 10, label)
        pdf.SetFont("Arial", "", 12)
        pdf.Cell(100, 10, value)
        pdf.Ln(8)
    }

	addLine("Name:", student.Name)
	addLine("Email:", student.Email)
	addLine("Student ID:", fmt.Sprintf("%d", student.ID))
    addLine("Class:", student.ClassName)
    addLine("Section:", student.SectionName)
    addLine("Roll No:", fmt.Sprintf("%d", student.Roll))
    addLine("Phone:", student.Phone)
    addLine("Father's Name:", student.FatherName)
    addLine("Mother's Name:", student.MotherName)
    addLine("Address:", student.Address)

	return pdf
}

func reportHandler(w http.ResponseWriter, r *http.Request) {
    // Path: /api/v1/students/:id/report
    // Split path to get ID
    // Expected path: /api/v1/students/{id}/report
    
    parts := strings.Split(r.URL.Path, "/")
    if len(parts) < 5 {
        http.Error(w, "Invalid URL", http.StatusBadRequest)
        return
    }
    // parts[0] = ""
    // parts[1] = "api"
    // parts[2] = "v1"
    // parts[3] = "students"
    // parts[4] = {id}
    // parts[5] = "report"
    
    studentID := parts[4]
    
    backendURL := os.Getenv("BACKEND_URL")
    if backendURL == "" {
        backendURL = "http://localhost:5007"
    }

    reqURL := fmt.Sprintf("%s/api/v1/students/%s", backendURL, studentID)
    client := &http.Client{}
    req, err := http.NewRequest("GET", reqURL, nil)
    if err != nil {
        http.Error(w, "Failed to create request", http.StatusInternalServerError)
        return
    }

    authHeader := r.Header.Get("Authorization")
    if authHeader != "" {
        req.Header.Add("Authorization", authHeader)
    }
    cookieHeader := r.Header.Get("Cookie")
    log.Printf("Received Cookie Header: %s", cookieHeader) 
    if cookieHeader != "" {
        req.Header.Add("Cookie", cookieHeader)
    }
    csrfHeader := r.Header.Get("X-Csrf-Token")
    if csrfHeader != "" {
        req.Header.Add("X-Csrf-Token", csrfHeader)
    }
    
    log.Printf("Outgoing Headers: %v", req.Header)

    resp, err := client.Do(req)
    if err != nil {
        log.Printf("Backend request failed: %v", err)
        http.Error(w, "Failed to fetch student data", http.StatusBadGateway)
        return
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        log.Printf("Backend returned status: %d", resp.StatusCode)
        http.Error(w, fmt.Sprintf("Backend refused request: %d", resp.StatusCode), http.StatusUnauthorized)
        return
    }

    var student Student
    if err := json.NewDecoder(resp.Body).Decode(&student); err != nil {
        log.Printf("JSON Decode failed: %v", err)
        http.Error(w, "Invalid JSON from backend", http.StatusInternalServerError)
        return
    }

    pdf := generatePDF(student)
    
    w.Header().Set("Content-Type", "application/pdf")
    w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=student_%s_report.pdf", studentID))
    if err := pdf.Output(w); err != nil {
        log.Printf("PDF Output failed: %v", err)
        http.Error(w, "Failed to generate PDF", http.StatusInternalServerError)
    }
}

func main() {
	http.HandleFunc("/api/v1/students/", reportHandler)

	log.Println("Go Service running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
