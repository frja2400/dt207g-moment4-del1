const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    account_created: {
        type: Date,
        default: Date.now
    }
});

//Hasha lösenord körs innan vi lagrar en ny användare.
userSchema.pre("save", async function(next) {
    try {
        //Kontrollera om lösenord är nytt eller har ändrats
        if(this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            //Ersätter lösenord med det hashade lösenordet
            this.password = hashedPassword;
        }

        //Fortsätter till nästa (lagra användare)
        next();
    } catch(error) {
        next(error);
    }
});

//Lagra/registrera en ny användare
userSchema.statics.register = async function (username, password) {
    try {
        //Skapa ny användare och spara i databasen.
        const user = new this({ username, password });
        await user.save();
        return user;
    } catch(error) {
        throw error;
    }
};

//Jämför hashade lösenord
userSchema.methods.comparePassword = async function (password) {
    try {
        //Är det hashade lösenordet likadant som det inmatade lösenordet.
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}

//Logga in användare
userSchema.statics.login = async function (username, password) {
    try {
        //Kollar om användare finns i databsen
        const user = await this.findOne({ username });
        if (!user) {
            throw new Error("Incorrect username/password");
        }

        //Använd metoden innan för att jämföra det inmatade lösenordet med det hashade.
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            throw new Error("Incorrect username/password");
        }

        return user;
    } catch (error) {
        throw error;
    }
};

//Skapar en mongoose-modell baserat på userSchema. Denna kopplas till min collection i mondoDB atlas.
//Modellen används för att spara, läsa, hantera användare. 
const User = mongoose.model("User", userSchema);
//Exporterar modellen
module.exports = User;