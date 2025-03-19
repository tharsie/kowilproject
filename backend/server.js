const sql = require("mssql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
const port = 3000;


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

// Create a pool connection
const poolPromise = new sql.ConnectionPool(dbConfig)
.connect()
.then((pool) => {
  console.log("Connected to the database");
  return pool;
})
.catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

const authenticateToken = (req, res, next) => {
  console.log("Token:", req);

  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer
 
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, "defe3a1ad2e0036777934a2f131f39d31d770f384ad39d1ea1186a9252833102", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    // Attach user data to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};


//adding members
app.post("/api/members",  async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    dob,
    gender,
    phoneNumber,
    email,
    street,
    city,
    state,
    postalCode,
    country,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !firstName ||
    !lastName ||
    !dob ||
    !gender ||
    !phoneNumber ||
    !email ||
    !street ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Get the pool object (ensure the pool is already initialized elsewhere in your app)
    const pool = await poolPromise;

    // Start a transaction using the pooled connection
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Insert into tblMember and retrieve MemberId
      const memberResult = await transaction.request()
        .input("Title", sql.NVarChar(50), title)
        .input("FirstName", sql.NVarChar(100), firstName)
        .input("LastName", sql.NVarChar(100), lastName)
        .input("DOB", sql.Date, dob)
        .input("Gender", sql.NVarChar(10), gender)
        .input("PhoneNumber", sql.NVarChar(20), phoneNumber)
        .input("Email", sql.NVarChar(100), email)
        .input("IsEdit", sql.Int, 1)
        .input("IsActive", sql.Int, 1)
        .input("CreatedDate", sql.DateTime, new Date())
        .input("CreatedBy", sql.NVarChar(100), "Admin")
        .input("UpdatedDate", sql.DateTime, new Date())
        .input("UpdatedBy", sql.NVarChar(100), "Admin")
        .query(`
          INSERT INTO tblMember (Title, FirstName, LastName, DOB, Gender, PhoneNumber, Email, 
                                 IsEdit, IsActive, CreatedDate, CreatedBy, UpdatedDate, UpdatedBy)
          OUTPUT INSERTED.MemberId
          VALUES (@Title, @FirstName, @LastName, @DOB, @Gender, @PhoneNumber, @Email,
                  @IsEdit, @IsActive, @CreatedDate, @CreatedBy, @UpdatedDate, @UpdatedBy);
        `);

      const memberId = memberResult.recordset[0].MemberId; // Get inserted MemberId

      // Insert into tblAddress and retrieve AddressId
      const addressResult = await transaction.request()
        .input("Street", sql.NVarChar(255), street)
        .input("City", sql.NVarChar(100), city)
        .input("State", sql.NVarChar(100), state)
        .input("PostalCode", sql.NVarChar(20), postalCode)
        .input("Country", sql.NVarChar(100), country)
        .query(`
          INSERT INTO tblAddress (Street, City, State, PostalCode, Country)
          OUTPUT INSERTED.AddressId
          VALUES (@Street, @City, @State, @PostalCode, @Country);
        `);

      const addressId = addressResult.recordset[0].AddressId; // Get inserted AddressId

      // Now update both tables with the corresponding foreign keys
      // Update tblMember with the AddressId
      await transaction.request()
        .input("MemberId", sql.Int, memberId)
        .input("AddressId", sql.Int, addressId)
        .query(`
          UPDATE tblMember
          SET AddressId = @AddressId
          WHERE MemberId = @MemberId;
        `);

      // Update tblAddress with the MemberId
      await transaction.request()
        .input("AddressId", sql.Int, addressId)
        .input("MemberId", sql.Int, memberId)
        .query(`
          UPDATE tblAddress
          SET MemberId = @MemberId
          WHERE AddressId = @AddressId;
        `);

      // Commit the transaction
      await transaction.commit();

      // Respond with the newly inserted member and their address ID
      res.status(201).json({ 
        message: "Member and address added successfully!", 
        memberId: memberId, 
        addressId: addressId 
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction Error:", error);
      res.status(500).json({ error: "Database transaction error" });
    }
  } catch (err) {
    console.error("Database Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }finally {
    sql.close();
  }
});


// Route to fetch all members
// Example: Using connection pool for fetching members and their addresses
app.get("/api/members", authenticateToken, async (req, res) => {
  try {
    // Get the pool object (ensure the pool is already initialized elsewhere in your app)
    const pool = await poolPromise;

    // Query to get all members with their address details
    const result = await pool.request()
      .query(`
        SELECT 
          m.MemberId, 
          m.Title, 
          m.FirstName, 
          m.LastName, 
          m.Dob, 
          m.Gender, 
          m.PhoneNumber, 
          m.Email, 
          a.Street, 
          a.City, 
          a.State, 
          a.PostalCode, 
          a.Country
        FROM tblMember m
        LEFT JOIN tblAddress a ON m.AddressId = a.AddressId;

      `);

    // Respond with the combined list of members and their addresses
    res.status(200).json(result.recordset); // result.recordset contains the rows returned
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Database error" });
  }finally {
    sql.close();
  }
});



// Route to update member details
app.put("/api/members/:id", async (req, res) => {
  console.log("Received data:", req.body); // Debugging request body

  const { id } = req.params;
  const {
    title,
    firstName,
    lastName,
    dob,
    gender,
    phoneNumber,
    email,
    street,
    city,
    state,
    postalCode,
    country
  } = req.body;

  // Check if all required fields are provided
  if (
    !title ||
    !firstName ||
    !lastName ||
    !dob ||
    !gender ||
    !phoneNumber ||
    !email ||
    !street ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Get the pool object (ensure pool is initialized)
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Update tblMember details
      const memberResult = await transaction.request()
        .input("MemberId", sql.Int, id)
        .input("Title", sql.NVarChar(50), title)
        .input("FirstName", sql.NVarChar(100), firstName)
        .input("LastName", sql.NVarChar(100), lastName)
        .input("DOB", sql.Date, dob)
        .input("Gender", sql.NVarChar(10), gender)
        .input("PhoneNumber", sql.NVarChar(20), phoneNumber)
        .input("Email", sql.NVarChar(100), email)
        .input("UpdatedDate", sql.DateTime, new Date())
        .input("UpdatedBy", sql.NVarChar(100), "Admin")
        .query(`
          UPDATE tblMember
          SET Title = @Title,
              FirstName = @FirstName,
              LastName = @LastName,
              DOB = @DOB,
              Gender = @Gender,
              PhoneNumber = @PhoneNumber,
              Email = @Email,
              UpdatedDate = @UpdatedDate,
              UpdatedBy = @UpdatedBy
          WHERE MemberId = @MemberId;
        `);

      // Check if member exists
      if (memberResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: "Member not found" });
      }

      // Get AddressId linked to the MemberId
      const addressResult = await transaction.request()
        .input("MemberId", sql.Int, id)
        .query(`SELECT AddressId FROM tblMember WHERE MemberId = @MemberId;`);

      if (!addressResult.recordset.length) {
        await transaction.rollback();
        return res.status(404).json({ error: "Address not found for this member" });
      }

      const addressId = addressResult.recordset[0].AddressId;

      // Update tblAddress
      await transaction.request()
        .input("AddressId", sql.Int, addressId)
        .input("Street", sql.NVarChar(255), street)
        .input("City", sql.NVarChar(100), city)
        .input("State", sql.NVarChar(100), state)
        .input("PostalCode", sql.NVarChar(20), postalCode)
        .input("Country", sql.NVarChar(100), country)
        .query(`
          UPDATE tblAddress
          SET Street = @Street,
              City = @City,
              State = @State,
              PostalCode = @PostalCode,
              Country = @Country
          WHERE AddressId = @AddressId;
        `);

      // Commit the transaction
      await transaction.commit();

      // Success response
      res.status(200).json({
        message: "Member updated successfully!",
        memberId: id,
        addressId: addressId
      });

    } catch (error) {
      await transaction.rollback();
      console.error("Transaction Error:", error);
      res.status(500).json({ error: "Database transaction error" });
    }
  } catch (err) {
    console.error("Database Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }finally {
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
    // Use the poolPromise to get a connection from the pool
    const pool = await poolPromise;

    // Check if email already exists
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (result.recordset.length > 0) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with ClientId = 1
    await pool.request()
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('phoneNumber', sql.NVarChar, phoneNumber)
      .input('email', sql.NVarChar, email)
      .input('hashedPassword', sql.NVarChar, hashedPassword)
      .input('ClientId', sql.Int, 1)
      .query(`
        INSERT INTO Users (firstName, lastName, phoneNumber, email, password, ClientId)
        VALUES (@firstName, @lastName, @phoneNumber, @email, @hashedPassword, @ClientId)
      `);

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
  }finally {
    sql.close();
  }
});


//receipt type
app.post("/api/receipt-types", async (req, res) => {
  const { newType, price_type, sequence_txt, sequence_num, prices } = req.body;

  // Validation for newType
  if (!newType || newType.trim() === "") {
    return res.status(400).json({ error: "The 'name' field cannot be empty." });
  }

  if (price_type === 'multiple' && (!prices || prices.length === 0)) {
    return res.status(400).json({ error: "Prices are required when price_type is 'multiple'" });
  }

  try {
    // Use the connection pool
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);  // Use the transaction with the pool

    await transaction.begin();

    // Insert into receipt_types and retrieve the inserted ID
    const receiptTypeQuery = `
      INSERT INTO receipt_types (name, price_type)
      OUTPUT INSERTED.id AS receiptTypeId
      VALUES (@newType, @price_type);
    `;

    const receiptTypeRequest = new sql.Request(transaction);
    receiptTypeRequest.input("newType", sql.NVarChar, newType);  // Correct input name
    receiptTypeRequest.input("price_type", sql.NVarChar, price_type);

    const receiptTypeResult = await receiptTypeRequest.query(receiptTypeQuery);
    const receiptTypeId = receiptTypeResult.recordset[0].receiptTypeId;

    // Insert into tblSequence with the retrieved ReceiptTypeID
    const sequenceQuery = `
      INSERT INTO tblSequence (SequenceText, SequenceNumber, ReceiptTypeID)
      VALUES (@sequence_txt, @sequence_num, @receiptTypeId);
    `;

    const sequenceRequest = new sql.Request(transaction);
    sequenceRequest.input("sequence_txt", sql.NVarChar, sequence_txt);
    sequenceRequest.input("sequence_num", sql.Int, sequence_num);
    sequenceRequest.input("receiptTypeId", sql.Int, receiptTypeId);

    await sequenceRequest.query(sequenceQuery);

    // Insert multiple prices into tblMultiPrices if price_type is 'multiple'
    if (price_type === 'multiple' && Array.isArray(prices) && prices.length > 0) {
      const priceQueries = prices.map(price => {
        const priceQuery = `
          INSERT INTO tblMultiPrices (ReceiptTypeID, Price)
          VALUES (@receiptTypeId, @price);
        `;
        
        const priceRequest = new sql.Request(transaction);
        priceRequest.input("receiptTypeId", sql.Int, receiptTypeId);
        priceRequest.input("price", sql.Decimal(10, 2), price);

        return priceRequest.query(priceQuery);
      });
      // Execute all price queries
      await Promise.all(priceQueries);
    }

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({ message: "Receipt type, sequence, and prices added successfully!" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    sql.close();
  }
});




//get receipt type
app.get("/api/receipt-types",authenticateToken, async (req, res) => {
  try {
    // Use the connection pool
    const pool = await poolPromise;

    // Query to get all receipt types with their sequence information
    const query = `
      SELECT
        r.id AS receiptTypeId,
        r.name AS receiptTypeName,
        s.SequenceText AS sequenceText,
        s.SequenceNumber AS sequenceNumber
      FROM receipt_types r
      LEFT JOIN tblSequence s ON r.id = s.ReceiptTypeID;
    `;
    const result = await pool.request().query(query);

    // Check if there are results and send as response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // Send the array of receipt types and sequences
    } else {
      res.status(404).json({ message: "No receipt types or sequences found" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch receipt types and sequences" });
  } finally {
    sql.close();
  }
});




app.put("/api/receipt-types/:id", async (req, res) => {
  const { id } = req.params; // Get the receipt type ID from the URL
  const { name, price_type, sequence_txt, sequence_num, prices } = req.body;

  // Validation
  if (!name || !price_type || !sequence_txt || !sequence_num) {
    return res.status(400).json({ error: "All fields except prices are required" });
  }

  if (price_type === 'multiple' && (!prices || prices.length === 0)) {
    return res.status(400).json({ error: "Prices are required when price_type is 'multiple'" });
  }

  try {
    // Use the connection pool
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);  // Use the transaction with the pool

    await transaction.begin();

    // Update the receipt type
    const receiptTypeQuery = `
      UPDATE receipt_types
      SET name = @name, price_type = @price_type
      WHERE id = @id;
    `;

    const receiptTypeRequest = new sql.Request(transaction);
    receiptTypeRequest.input("id", sql.Int, id);
    receiptTypeRequest.input("name", sql.NVarChar, name);
    receiptTypeRequest.input("price_type", sql.NVarChar, price_type);

    const result = await receiptTypeRequest.query(receiptTypeQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Receipt type not found" });
    }

    // Update the sequence for the receipt type
    const sequenceQuery = `
      UPDATE tblSequence
      SET SequenceText = @sequence_txt, SequenceNumber = @sequence_num
      WHERE ReceiptTypeID = @id;
    `;

    const sequenceRequest = new sql.Request(transaction);
    sequenceRequest.input("sequence_txt", sql.NVarChar, sequence_txt);
    sequenceRequest.input("sequence_num", sql.Int, sequence_num);
    sequenceRequest.input("id", sql.Int, id);

    await sequenceRequest.query(sequenceQuery);

    // If price_type is 'multiple', update the prices in tblMultiPrices
    if (price_type === 'multiple' && Array.isArray(prices) && prices.length > 0) {
      // Delete existing prices for the receipt type
      const deletePricesQuery = `
        DELETE FROM tblMultiPrices
        WHERE ReceiptTypeID = @id;
      `;
      
      const deletePricesRequest = new sql.Request(transaction);
      deletePricesRequest.input("id", sql.Int, id);

      await deletePricesRequest.query(deletePricesQuery);

      // Insert new prices
      const priceQueries = prices.map(price => {
        const priceQuery = `
          INSERT INTO tblMultiPrices (ReceiptTypeID, Price)
          VALUES (@receiptTypeId, @price);
        `;
        
        const priceRequest = new sql.Request(transaction);
        priceRequest.input("receiptTypeId", sql.Int, id);
        priceRequest.input("price", sql.Decimal(10, 2), price);

        return priceRequest.query(priceQuery);
      });
      // Execute all price queries
      await Promise.all(priceQueries);
    }

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({ message: "Receipt type, sequence, and prices updated successfully!" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    sql.close();
  }
});


//receipt post
app.post("/api/receipts", async (req, res) => {
  console.log("Incoming request body:", req.body); // Debugging log

  const {
    name,
    amount,
    amountInWords,
    date,
    receiptTypeName,
    dropdownValue,
    secondDropdownValue,
    selectedRadio,
  } = req.body;

  if (!name || (!amount && receiptTypeName !== "அர்ச்சனை") || !date || !receiptTypeName) {
    console.error("Validation failed:", req.body);
    return res.status(400).json({
      error: "Name, Date, and Receipt Type are required. Amount is required unless Receipt Type is 'அர்ச்சனை'.",
    });
  }

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const receiptResult = await transaction.request()
        .input("Name", sql.NVarChar(255), name)
        .input("Amount", sql.Decimal(10, 2), amount || null)
        .input("AmountInWords", sql.NVarChar(500), amountInWords || null)
        .input("Date", sql.Date, date)
        .input("ReceiptType", sql.NVarChar(255),receiptTypeName)
        .input("DropdownValue", sql.NVarChar(255), dropdownValue || null)
        .input("SecondDropdownValue", sql.NVarChar(255), secondDropdownValue || null)
        .input("SelectedRadio", sql.NVarChar(255), selectedRadio || null)
        .query(`
          INSERT INTO tblReceipts (name, amount, amountInWords, date, receiptType, 
                                   dropdownValue, secondDropdownValue, selectedRadio)
          OUTPUT INSERTED.id
          VALUES (@Name, @Amount, @AmountInWords, @Date, @ReceiptType, 
                  @DropdownValue, @SecondDropdownValue, @SelectedRadio);
        `);

      const receiptId = receiptResult.recordset[0].id;
      console.log("Receipt successfully saved:", receiptId);

      await transaction.commit();
      res.status(201).json({ message: "Receipt added successfully!", receiptId });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction Error:", error);
      res.status(500).json({ error: "Database transaction error", details: error.message });
    }
  } catch (err) {
    console.error("Database Connection Error:", err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});




//receipt get
app.get("/api/receipts",authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise; // Use the pool
    const result = await pool.request().query("SELECT * FROM tblReceipts");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ error: "Failed to fetch receipts", details: error.message });
  }
});

app.put("/api/receipts/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    amount,
    amountInWords,
    date,
    receiptTypeName,
    dropdownValue,
    secondDropdownValue,
    selectedRadio,
  } = req.body;

  // Validate required fields
  if (!name || (!amount && receiptTypeName !== "அர்ச்சனை") || !date || !receiptTypeName) {
    return res.status(400).json({ error: "Name, Date, and Receipt Type are required. Amount is required unless Receipt Type is 'அர்ச்சனை'." });
  }

  try {
    // Use the connection pool
    const pool = await poolPromise;

    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Update the receipt in tblReceipts
      const updateResult = await transaction.request()
        .input("Id", sql.Int, id)
        .input("Name", sql.NVarChar(255), name)
        .input("Amount", sql.Decimal(10, 2), amount || null)
        .input("AmountInWords", sql.NVarChar(500), amountInWords || null)
        .input("Date", sql.Date, date)
        .input("ReceiptType", sql.NVarChar(255), receiptTypeName)
        .input("DropdownValue", sql.NVarChar(255), dropdownValue || null)
        .input("SecondDropdownValue", sql.NVarChar(255), secondDropdownValue || null)
        .input("SelectedRadio", sql.NVarChar(255), selectedRadio || null)
        .query(`
          UPDATE tblReceipts
          SET name = @Name,
              amount = @Amount,
              amountInWords = @AmountInWords,
              date = @Date,
              receiptType = @ReceiptType,
              dropdownValue = @DropdownValue,
              secondDropdownValue = @SecondDropdownValue,
              selectedRadio = @SelectedRadio
          WHERE id = @Id;
        `);

      if (updateResult.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({
        message: "Receipt updated successfully!",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction Error:", error);
      res.status(500).json({ error: "Database transaction error" });
    }
  } catch (err) {
    console.error("Database Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  } finally {
    sql.close();
  }
});

app.delete("/api/receipts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Use the connection pool
    const pool = await poolPromise;

    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Delete the receipt from tblReceipts
      const deleteResult = await transaction.request()
        .input("Id", sql.Int, id)
        .query(`
          DELETE FROM tblReceipts WHERE id = @Id;
        `);

      if (deleteResult.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({
        message: "Receipt deleted successfully!",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction Error:", error);
      res.status(500).json({ error: "Database transaction error" });
    }
  } catch (err) {
    console.error("Database Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  } finally {
    sql.close();
  }
});



// POST Route to Add a Donation
app.post("/api/donations", async (req, res) => {
  const { name, phoneNumber, reason, amount } = req.body;

  if (!name || !phoneNumber || !reason || !amount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create connection to SQL Server using dbConfig
    const pool = await sql.connect(dbConfig);

    // Insert the new donation into the database
    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("phoneNumber", sql.NVarChar, phoneNumber)
      .input("reason", sql.NVarChar, reason)
      .input("amount", sql.Float, amount)
      .query(`
        INSERT INTO tblDonations (name, phoneNumber, reason, amount)
        VALUES (@name, @phoneNumber, @reason, @amount);
      `);

    // Return success response if donation is added
    res.status(201).json({
      message: "Donation added successfully!",
      donation: {
        name,
        phoneNumber,
        reason,
        amount,
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    sql.close();
  }
});


// get for donations
app.get('/api/donations',authenticateToken, async (req, res) => {
  try {
    // Create a connection to the database
    const pool = await sql.connect(dbConfig);

    // Fetch all donations from the database
    const result = await pool.request().query('SELECT * FROM tblDonations');

    // Return the fetched donations in the response
    res.status(200).json({
      donations: result.recordset, // Return the rows of the donations table
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  } finally {
    sql.close();
  }
});

// PUT Route to Update a Donation
app.put("/api/donations/:id", async (req, res) => {
  const { id } = req.params; // Get the donation ID from the URL parameter
  const { name, phoneNumber, reason, amount } = req.body;

  if (!name || !phoneNumber || !reason || !amount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create connection to SQL Server using dbConfig
    const pool = await sql.connect(dbConfig);

    // Update the donation in the database
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("phoneNumber", sql.NVarChar, phoneNumber)
      .input("reason", sql.NVarChar, reason)
      .input("amount", sql.Float, amount)
      .query(`
        UPDATE tblDonations
        SET name = @name, phoneNumber = @phoneNumber, reason = @reason, amount = @amount
        WHERE id = @id;
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Donation not found." });
    }

    // Return success response if donation is updated
    res.status(200).json({
      message: "Donation updated successfully!",
      donation: {
        id,
        name,
        phoneNumber,
        reason,
        amount,
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    sql.close();
  }
});



//event post
app.post("/api/events", async (req, res) => {
  const { name, date, organizer } = req.body;

  if (!name || !date || !organizer) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create connection to SQL Server using dbConfig
    const pool = await sql.connect(dbConfig);

    // Insert new event into the database
    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("date", sql.Date, date)
      .input("organizer", sql.NVarChar, organizer)
      .query(`
        INSERT INTO tblEvents (name, date, organizer)
        VALUES (@name, @date, @organizer);
      `);

    // If the event was added successfully, return a success response
    res.status(201).json({
      message: "Event added successfully!",
      event: {
        name,
        date,
        organizer,
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    sql.close();
  }
});

// Route to fetch all events
app.get("/api/events",authenticateToken, async (req, res) => {
  try {
    // Create connection to SQL Server using dbConfig
    const pool = await sql.connect(dbConfig);

    // Query to get all events
    const result = await pool.request().query("SELECT * FROM tblEvents");

    // Return the events data as a response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    sql.close();
  }
});

app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const { name, date, organizer } = req.body;

  if (!name || !date || !organizer) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create connection to SQL Server using dbConfig
    const pool = await sql.connect(dbConfig);

    // Update the event in the database
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("date", sql.Date, date)
      .input("organizer", sql.NVarChar, organizer)
      .query(`
        UPDATE tblEvents
        SET name = @name, date = @date, organizer = @organizer
        WHERE id = @id;
      `);

    // Check if any row was updated
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({
      message: "Event updated successfully!",
      event: { id, name, date, organizer },
    });

  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    sql.close();
  }
});


app.get("/api/top-donors",authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT TOP 4 name, SUM(amount) AS totalDonated
      FROM tblReceipts
      WHERE amount IS NOT NULL
      GROUP BY name
      ORDER BY totalDonated DESC
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching top donors:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});


app.get("/", (req, res) => {
  res.send("Server is running!");
});
process.on('SIGINT', async () => {
  try {
    await sql.close();
    console.log('Connection pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing connection pool', err);
    process.exit(1);
  }
});
// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
