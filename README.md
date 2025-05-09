# User API

Detta repository innehåller kod för en webbtjänst byggt med Node.js, Express och MongoDB Atlas. API:t är byggt för att skapa användarkonton och logga in användare. Autentisering krävs för en skyddad route med hjälp av JWT.

## Länk

En liveversion av API:t finns tillgänglig på följande URL: https://dt207g-moment4-del1.onrender.com/

## Installation, databas

API:et använder en databas i MongoDB Atlas. Klona ner källkodsfilerna, kör kommando npm install för att installera beroenden. Lägg till din MondoDB-anslutningssträng i en .env-fil samt generera en JWT_SECRET_KEY. Kör npm run dev för att starta servern.

API:et använder en MongoDB-databas och en Mongoose-model som representerar användare i en collection kallad users.

```js
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
```

## Användning

Nedan finns beskrivet hur man når APIet på olika vis:

| Metod  | Ändpunkt                  | Beskrivning                                                                 |
|--------|---------------------------|-----------------------------------------------------------------------------|
| GET    | `/protected`              | Skyddad route som använder en middleware för att kontrollera token.         |
| POST   | `/register`               | Skapar en användare efter att ha validerat inmatade värden.                 |
| POST   | `/login`                  | Loggar in en användare efter att ha validerat inmatade värden.              |

En användare skickas som JSON med följande struktur:

```json
{
   "username": "Frida",
   "password": "password"
}
```

Användares lösenord blir hashad vid registrering. Vid inloggning jämförs det inmatade lösenordet med det hashade lösenordet. Vid inloggning skickas en JWT token med för autentisering vid en skyddad route.