const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());

const dbConfig = {
  user: "KowilDb",
  password: "Welcome@2025",
  server: "184.75.213.133",
  database: "TestData",
  port: 1623,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};



//adding members
// Route to handle POST request for adding a member
app.post("/api/members", async (req, res) => {
  const { title, firstName, lastName, email, mobile, dob, gender, street, city, province, country } = req.body;

  // Check if all fields are provided
  if (!title || !firstName || !lastName || !email || !mobile || !dob || !gender || !street || !city || !province || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Connect to the MS SQL Server
    await sql.connect(dbConfig);

    // SQL query to insert a new member into the database
    const query = `
      INSERT INTO Members (title, firstName, lastName, email, mobile, dob, gender, street, city, province, country)
      VALUES (@title, @firstName, @lastName, @email, @mobile, @dob, @gender, @street, @city, @province, @country);
    `;

    // Prepare and execute the SQL query with parameterized values
    await sql.query(`
      DECLARE @title NVARCHAR(50), @firstName NVARCHAR(100), @lastName NVARCHAR(100), @email NVARCHAR(100),
              @mobile NVARCHAR(20), @dob DATE, @gender NVARCHAR(10), @street NVARCHAR(255), @city NVARCHAR(100),
              @province NVARCHAR(100), @country NVARCHAR(100);
              
      SET @title = '${title}';
      SET @firstName = '${firstName}';
      SET @lastName = '${lastName}';
      SET @email = '${email}';
      SET @mobile = '${mobile}';
      SET @dob = '${dob}';
      SET @gender = '${gender}';
      SET @street = '${street}';
      SET @city = '${city}';
      SET @province = '${province}';
      SET @country = '${country}';

      ${query}
    `);

    // Respond with a success message
    res.status(201).json({ message: "Member added successfully!" });
  } catch (err) {
    console.error("Error inserting member:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Close the database connection
    sql.close();
  }
});

// Route to fetch all members
app.get("/api/members", async (req, res) => {
  try {
    // Connect to the MS SQL Server
    await sql.connect(dbConfig);

    // Query to get all members from the database
    const result = await sql.query("SELECT * FROM members ");

    // Respond with the list of members
    res.status(200).json(result.recordset); // result.recordset contains the rows returned
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Close the database connection
    sql.close();
  }
});

// Route to update member details
app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const { title, firstName, lastName, email, mobile, dob, gender, street, city, province, country } = req.body;

  // Check if all fields are provided
  if (!title || !firstName || !lastName || !email || !mobile || !dob || !gender || !street || !city || !province || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Connect to the MS SQL Server
    await sql.connect(dbConfig);

    // SQL query to update the member details
    const query = `
      UPDATE Members
      SET title = @title, firstName = @firstName, lastName = @lastName, email = @email, mobile = @mobile, 
          dob = @dob, gender = @gender, street = @street, city = @city, province = @province, country = @country
      WHERE id = @id;
    `;

    // Prepare and execute the SQL query with parameterized values
    const result = await sql.query(
      `DECLARE @id INT, @title NVARCHAR(50), @firstName NVARCHAR(100), @lastName NVARCHAR(100), @email NVARCHAR(100),
               @mobile NVARCHAR(20), @dob DATE, @gender NVARCHAR(10), @street NVARCHAR(255), @city NVARCHAR(100),
               @province NVARCHAR(100), @country NVARCHAR(100);

       SET @id = ${id};  -- Parameterize the id value
       SET @title = '${title}';
       SET @firstName = '${firstName}';
       SET @lastName = '${lastName}';
       SET @email = '${email}';
       SET @mobile = '${mobile}';
       SET @dob = '${dob}';
       SET @gender = '${gender}';
       SET @street = '${street}';
       SET @city = '${city}';
       SET @province = '${province}';
       SET @country = '${country}';

       ${query}`
    );

    // Respond with a success message
    res.status(200).json({ message: "Member updated successfully!" });
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Close the database connection
    sql.close();
  }
});


// Route to delete a member
app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Connect to the MS SQL Server
    await sql.connect(dbConfig);

    // SQL query to delete the member from the database
    const query = `
      DELETE FROM members WHERE id = @id;
    `;

    // Execute the SQL query with parameterized values
    const result = await sql.query(
      `DECLARE @id INT;
       SET @id = ${id};  -- Remove this line, parameterize the query instead

       ${query}`
    );

    // Check if a row was affected (if no rows were affected, return 404)
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Member deleted successfully!" });
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Close the database connections
    sql.close();
  }
});

//Register user

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
  }

  try {
      await sql.connect(dbConfig);

      // Check if email exists
      const result = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
      if (result.recordset.length > 0) {
          return res.status(400).json({ error: "Email already registered!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await sql.query`
          INSERT INTO Users (firstName, lastName, phoneNumber, email, password)
          VALUES (${firstName}, ${lastName}, ${phoneNumber}, ${email}, ${hashedPassword})
      `;

      res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: "Database error!" });
  } finally {
      sql.close();
  }
});

//login user

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request()
          .input("email", sql.VarChar, email)
          .query("SELECT * FROM Users WHERE email = @email");

      if (result.recordset.length === 0) {
          return res.status(400).json({ error: "User not found!" });
      }

      const user = result.recordset[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid password!" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, "defe3a1ad2e0036777934a2f131f39d31d770f384ad39d1ea1186a9252833102", {
          expiresIn: "1h",
      });

      res.json({ message: "Login successful!", token });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

//receipt type
//add type
app.post("/api/receipt-types", async (req, res) => {
  const { name, price_type, sequence_txt, sequence_num } = req.body;

  // Validate input
  if (!name || !price_type || !sequence_txt || !sequence_num) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Connect to the MS SQL Server
    await sql.connect(dbConfig);

    // Define SQL query with parameters
    const query = `
      INSERT INTO receipt_types (name, price_type, sequence_txt, sequence_num)
      VALUES (@name, @price_type, @sequence_txt, @sequence_num);
    `;

    // Use parameterized queries to avoid SQL injection
    const request = new sql.Request();
    request.input("name", sql.NVarChar, name);
    request.input("price_type", sql.NVarChar, price_type);
    request.input("sequence_txt", sql.NVarChar, sequence_txt);
    request.input("sequence_num", sql.Int, sequence_num);

    // Execute the query
    await request.query(query);

    // Send success response
    res.status(201).json({ message: "Receipt type added successfully!" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Close the database connection
    sql.close();
  }
});

//get receipt type

app.get("/api/receipt-types", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);

    // Execute the query
    const result = await sql.query(`
      SELECT id, name, price_type, sequence_txt, sequence_num 
      FROM receipt_types 
      ORDER BY sequence_num ASC;
    `);

    // Log the result to check if data is returned
    console.log("Result:", result.recordset);

    // Send response
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching receipt types:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    sql.close(); // Ensure the connection is closed
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
