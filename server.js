const express = require('express');
const bodyParser = require('body-parser');              //Använder body-parser för att kunna läsa JSON i req.body
const authRoutes = require('./routes/auth-routes');     //Importerar routes från separat fil
require('dotenv').config();

//Skapar express-app
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//Routes
//Kopplar min auth-route till rotsökväg /api.
app.use("/api", authRoutes);

//Startar applikation
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});