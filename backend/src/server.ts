import mysql from "mysql2";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const app = express()
app.use(cors());
app.use(express.json());
const port = 3000

const database_connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users"
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: "Túl sok bejelentkezési próbálkozás. Próbáld később!" }
});

const registerLimiter = rateLimit({
  windowMs: 60* 60 * 1000,
  max: 5, 
  message: { success: false, message: "Túl sok regisztrációs próbálkozás. Próbáld később!" }
});

function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ success: false, message: "Token required" });

  jwt.verify(token, "titkoskulcs", (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
}

//const mfaCodes: { [username: string]: string } = {};

app.post('/login', loginLimiter, (req: any, res: any) => {
  const { username, password } = req.body;

  database_connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Adatbázis hiba: " + error.message });
      }

      if ((result as any).length === 0) {
        return res.status(500).json({ success: false, message: "null" });
      }

      const user = (result as any)[0];
      const validatePassword = await bcrypt.compare(password, user.password);

      if (validatePassword == true) {
        /*const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        mfaCodes[username] = mfaCode;*/
        //res.json({ success: true, mfaRequired: true, message: "MFA kód szükséges", mfaCode });
        const token = jwt.sign({ username: user.username }, "titkoskulcs", { expiresIn: "1h" });
        res.json({ success: true, token, message: "Sikeres bejelentkezés " + user.username + " felhasználóként!" });
      }
      else {
          res.status(401).json({ success: false, message: "Hibás felhasználónév vagy jelszó!" });
      }
    }
  )
})

app.post('/register', registerLimiter, async (req: any, res: any) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  database_connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Adatbázis hiba: " + error.message });
      }
      if ((result as any).length > 0) {
        return res.json({ success: false, message: "Ez a felhasználónév már foglalt." })
      }

      database_connection.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        async (error, result) => {
          if (error) {
            return res.status(500).json({ success: false, message: "Hiba az adatok beszúrásánál az adatbázisba. Hiba: " + error.message });
          }

          if ((result as any).affectedRows === 0) {
            return res.status(500).json({ success: false, message: "A beszúrt sorok száma = 0." });
          }

          res.json({ success: true, message: "Sikeres regisztráció!" });
        }
      )
    });
})

app.get("/profile", authenticateToken, (req: any, res) => {
  res.json({ success: true, user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on: ${port}`)
})