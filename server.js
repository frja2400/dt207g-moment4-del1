const express = require('express');
const bodyParser = require('body-parser');              //Använder body-parser för att kunna läsa JSON i req.body
const authRoutes = require('./routes/auth-routes');     //Importerar routes från separat fil
const jwt = require('jsonwebtoken');
const path = require('path');                           //Path-modul för att referera till min index.html
const User = require("./models/user");                 //Importera User-modell
require('dotenv').config();
const cors = require('cors');                           //Importerar cors för att tillåta CORS-förfrågningar från min frontend.

//Skapar express-app
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use(cors());

//Routes

//För att visa en enkel HTML-sida som förklarar applikationen.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

//Kopplar min auth-route till rotsökväg /api.
app.use("/api", authRoutes);

//Skyddad route
app.get("/api/protected", authenticateToken, async (req, res) => {
    try {
        //Hämta alla användarnamn från min databas
        const users = await User.find({}, 'username')

        //Skicka tillbaka listan av användare som JSON
        res.json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

//Middleware som kollar token och skickar vidare till skyddad route.
function authenticateToken(req, res, next) {
    //Hämtar bearer-token
    const authHeader = req.headers['authorization'];
    //Tar bort "bearer"
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) res.status(401).json({ message: "Not authorized for this route, token missing." });

    //Verfieringsmetod med den hemliga nyckelns (som används för att skapa och verifiera token).
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if(err) return res.status(403).json({ message: "Not valid JWT" });

        //Om token är giltig skickas payload tillbaka (username)
        req.username = username;
        //Gå vidare till nästa route.
        next();
    });
}

//Startar applikation
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});