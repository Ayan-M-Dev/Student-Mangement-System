const http = require('http');
const fs = require('fs');

const BACKEND_PORT = 5007;
const REPORT_SERVICE_PORT = 8080;
const CREDENTIALS = JSON.stringify({
    username: "admin@school-admin.com",
    password: "3OU4zn3q6Zh9"
});

function makeRequest(port, path, method, headers, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: method,
            headers: headers
        };

        const req = http.request(options, (res) => {
            const chunks = [];
            res.on('data', (d) => chunks.push(d));
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat(chunks)
                });
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
}

async function verify() {
    const loginRes = await makeRequest(BACKEND_PORT, '/api/v1/auth/login', 'POST', {
        'Content-Type': 'application/json',
        'Content-Length': CREDENTIALS.length
    }, CREDENTIALS);

    if (loginRes.statusCode !== 200) {
        console.error("Login Failed!", loginRes.statusCode);
        console.error("Response:", loginRes.body.toString());
        return;
    }

    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie) {
        console.error("No Set-Cookie header received!");
        return;
    }

    const cookieMap = {};
    setCookie.forEach(c => {
        const part = c.split(';')[0];
        const [name, value] = part.split('=');
        if (name && value) {
            cookieMap[name.trim()] = value.trim();
        }
    });

    const cookieString = Object.entries(cookieMap)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    

    const csrfMatch = cookieString.match(/csrfToken=([^;]+)/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;

    if (!csrfToken) {
        console.error("No csrfToken found in cookies!");
        return;
    }

    const reportRes = await makeRequest(REPORT_SERVICE_PORT, '/api/v1/students/2/report', 'GET', {
        'Cookie': cookieString,
        'X-Csrf-Token': csrfToken
    });

    if (reportRes.statusCode === 200) {
        fs.writeFileSync('student_report.pdf', reportRes.body);
        if (reportRes.body.length > 1000) {
             console.log("File is a valid size.");
        } else {
             console.warn("File seems too small?");
        }
    } else {
        console.error("FAILURE! Report Request failed with status:", reportRes.statusCode);
    }
}

verify();
