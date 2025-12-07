# Go PDF Report Service Instructions

This service generates PDF report cards for students by fetching data from the main Node.js backend.

## Prerequisites

- Docker containers (`backend` and `report-service`) must be running.

## How to Test

We have provided a verification script that automates the login and report generation process.

### Step 1: Run the verification script

Run the following command from the `go-service` directory (or adjust path):

```bash
node verify-pdf.js
```

### Step 2: Check the Output

- If successful, you will see `SUCCESS! PDF Report received.`
- A file named `student_report.pdf` will be created in the current directory.
- Open the PDF to verify the content.

## Troubleshooting

- If you get `401 Unauthorized`, ensure the backend is running and the credentials in `verify-pdf.js` are correct.
- If you get `Connection Refused`, ensure the Go Service is running on port `8080`.

### Step 3: Manual Testing

You can also manually test the endpoint using `curl` or Postman:

```bash
curl http://localhost:8080/api/v1/students/2/report --output student_report.pdf
```
