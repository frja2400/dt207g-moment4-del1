const express = require('express');
const bodyParser = require('body-parser');              //Använder body-parser för att kunna läsa JSON i req.body
const authRoutes = require('./routes/auth-routes');     //Importerar routes från separat fil
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Skapar express-app
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//Routes
//Kopplar min auth-route till rotsökväg /api.
app.use("/api", authRoutes);

//Skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected route!" });
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