const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

//Anslut till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database");
});

//User modell (importera schema för min tabell)
const User = require("../models/user");

router.post("/register", async (req, res) => {

    try {
        const { username, password, account_created } = req.body;

        //Validera input
        //Samla valideringsfel i en array
        const errors = [];

        //Om användarnamn inte finns eller om den inte är av typen sträng eller om den är under 5 tecken(utan mellanslag).
        if (!username || typeof username !== 'string' || username.trim().length < 5) {
            //Pusha felmeddelande till arrayen med fält och meddelande.
            errors.push({
                field: "username",
                message: "Username is required and must be at least 5 characters long."
            });
        }

        if (!password || typeof password !== 'string' || password.length < 7) {
            errors.push({
                field: "password",
                message: "Password is required and must be at least 7 characters long."
            });
        }

        //Om det finns minst ett error skicka 400-fel
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Invalid input",
                details: errors,
                http_response: 400
            });
        }

        //Annars har användare skapats utan problem
        //Använder modellen User för att skapa ny användare
        const user = new User ({ username, password });
        await user.save();

        return res.status(201).json({
            message: "User created!",
            http_response: 201
        });


    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            error: "Server error",
            http_response: 500
        })
    }

});

router.post("/login", async (req, res) => {
    console.log("Login");
});

//Exporterar router-modulen så att den kan användas i andra delar av applikationen: server.js
module.exports = router;