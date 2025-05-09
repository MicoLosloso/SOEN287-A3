const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = 3334;
const session = require("express-session");
const USERS_FILE = path.join(__dirname, "users.txt");

app.use(express.static(__dirname));  
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Q8.html")); 
});

app.post("/createAccount", (req, res) => {
    const { username, password } = req.body;

    const usernameValid = /^[A-Za-z0-9]+$/.test(username);
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password);

    if (!usernameValid || !passwordValid) {
        return res.send(`
            <html>
                <head>
                    <title>Create Account Failed</title>
                </head>
                <body>
                    <script type="text/javascript">
                        alert("Account Creation Failes");
                        window.location.href = "/create.html"; 
                    </script>
                </body>
            </html>
        `);
    }

    const users = fs.readFileSync(USERS_FILE, "utf8").split("\n").filter(Boolean);

    const exists = users.some(line => line.split(":")[0] === username);

    if (exists) {
        return res.send(`
            <html>
                <head>
                    <title>Account Creation Failed</title>
                </head>
                <body>
                    <script type="text/javascript">
                        alert("Username Already Taken!");
                        window.location.href = "/create.html"; 
                    </script>
                </body>
            </html>
        `);
    }

    fs.appendFileSync(USERS_FILE, `${username}:${password}\n`);

    req.session.loggedIn = true;
    req.session.username = username;

    res.send(`
        <html>
            <head>
                <title>Successful</title>
            </head>
            <body>
                <script type="text/javascript">
                    alert("Account Created! You are now Logged In!");
                    window.location.href = "/Q8.html"; 
                </script>
            </body>
        </html>
    `);
});


app.post("/loggingIn", (req, res) => {
    const { username, password } = req.body;
    const users = fs.readFileSync(USERS_FILE, "utf8").split("\n").filter(Boolean);

    const user = users.find(line => {
        const [storedUsername, storedPassword] = line.split(":");
        return storedUsername === username && storedPassword === password;
    });

    if (user) {
        req.session.loggedIn = true;
        req.session.username = username;

        return res.send(`
            <html>
                <head>
                    <title>Login Successful</title>
                </head>
                <body>
                    <script type="text/javascript">
                        alert("Login Successful");
                        window.location.href = "/Q8.html"; // Redirect to the home page after login
                    </script>
                </body>
            </html>
        `);
    } else {
        return res.send(`
            <html>
                <head>
                    <title>Login Failed</title>
                </head>
                <body>
                    <script type="text/javascript">
                        alert("Invalid username or password");
                        window.location.href = "/login.html"; 
                    </script>
                </body>
            </html>
        `);
    }
});

function checkLogin(req, res, next) {
    if (req.session.loggedIn) {
        return next(); 
    } 
    else {
        res.send(`
            <html>
                <body>
                    <h2>You must be logged in to add a pet.</h2>
                    <a href="/login.html">Login</a>
                </body>
            </html>
        `);
    }
}

app.post('/giveAPet', checkLogin, (req, res) => {
    const {
        givePet,
        breed2,
        age,
        giveGender,
        givegetalong,
        Comments
    } = req.body;

    let currentCount = 0;
    const petsFile = path.join(__dirname, 'availablePets.txt');

    if (fs.existsSync(petsFile)) {
        const lines = fs.readFileSync(petsFile, 'utf8').trim().split('\n');
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            const lastId = parseInt(lastLine.split(':')[0], 10);
            currentCount = isNaN(lastId) ? 0 : lastId;
        }
    }

    const newId = currentCount + 1;
    const breeds = Array.isArray(breed2) ? breed2.join(',') : breed2 || 'none';

    const petEntry = [
        newId,
        givePet || 'unknown',
        breeds,
        age,
        giveGender || 'unknown',
        givegetalong || 'unknown',
        Comments.replace(/\r?\n|\r/g, ' ') 
    ].join(':') + '\n';

    fs.appendFileSync(petsFile, petEntry, 'utf8');

    res.send('<h2>Your pet has been added for adoption.</h2><a href="/">Go Back</a>');
});


app.post('/findPet', (req, res) => {
    const { pet, breed, age, gender, getalong } = req.body;
    const petsFile = path.join(__dirname, 'availablePets.txt');

    fs.readFile(petsFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send("Error reading pet file.");
        }

        const lines = data.trim().split('\n');
        let matches = [];

        for (const line of lines) {
            const parts = line.split(':');
            const petType = parts[1].toLowerCase();
            const petBreed = parts[2].toLowerCase();
            const petAge = parts[3].toLowerCase();
            const petGender = parts[4].toLowerCase();
            const petGetAlong = parts[5].toLowerCase();

            const breedMatch = !breed || breed.includes("other") || breed.map(b => b.toLowerCase()).includes(petBreed);
            const typeMatch = !pet || pet.toLowerCase() === petType;
            const ageMatch = age === "Doesn't Matter" || age.toLowerCase() === petAge;
            const genderMatch = gender === "dontmatter" || gender.toLowerCase() === petGender;
            const getalongMatch = !getalong || getalong.toLowerCase() === petGetAlong;

            if (typeMatch && breedMatch && ageMatch && genderMatch && getalongMatch) {
                matches.push(line);
            }
        }

        if (matches.length === 0) {
            res.send(`No pets match your criteria.<a href="/">Go Back</a>`);
        } 
        else {
            res.send(`<h2>Matching Pets:</h2><pre>${matches.join('\n')}</pre><a href="/">Go Back</a>`); }
    });
});


app.get("/logout",(req, res) => {
if(!req.session.loggedIn){
    return res.send(`
        <html>
            <head><title>Not Logged In</title></head>
            <body>
                <script>
                    alert("You must be logged in to log out.");
                    window.location.href = "/login.html";
                </script>
            </body>
        </html>
    `);
}
    req.session.destroy(err => {
        if (err) {
            return res.send("Logout failed.");
        }

        res.send(`
            <html>
                <head><title>Logged Out</title></head>
                <body>
                    <script>
                        alert("You have been logged out.");
                        window.location.href = "/Q8.html";
                    </script>
                </body>
            </html>
        `);
    });
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
