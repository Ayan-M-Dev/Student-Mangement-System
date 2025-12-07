# Assessment Verification Guide

## 1. Start the Environment
Run the following command to start all services (Frontend, Backend, Database, Blockchain, Go Service):

```bash
docker-compose up --build
```
*Wait for all containers to be healthy/running.*

## 2. Verify Solutions

### Problems 1 & 2: Frontend & Backend
*   **Action**: Open browser to [http://localhost:5173](http://localhost:5173).
*   **Login**: `admin@school-admin.com` / `3OU4zn3q6Zh9`
*   **Verify**: 
    1.  Click **"Notices"** -> **"Add Notice"**. Try adding one. (Problem 1 Fix)
    2.  Click **"Students"**. Confirm student list loads and you can Add/Edit/Delete. (Problem 2 CRUD)

### Problem 3: Blockchain
*   **Action**: 
    1.  **Automated**: Run `verify-blockchain.bat` (Windows) for a full headless verify.
    2.  **Manual (Frontend)**: 
        -   Go to Login Page -> Click **"Connect Wallet (Assessment)"**.
        -   Login as Admin.
        -   Go to **Students** -> Actions -> Click "Eye" Icon (View).
        -   Click **"Certificate" Tab**.
        -   Use **"Issue"** and **"Verify"** buttons to interact with the blockchain.
*   **Result**: 
    -   Script: Deploys, Issues, Verifies.
    -   Frontend: Signs transactions in MetaMask and displays certificate hash.

### Problem 4: Go PDF Service
*   **Action**: Run the verification client:
    ```bash
    node go-service/verify-pdf.js
    ```
*   **Result**: A file `student_report.pdf` will be downloaded to the root directory.

### Problem 5: DevOps
*   **Verification**: The fact that `docker-compose up` worked and all services are communicating.
