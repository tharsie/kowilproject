const express = require("express");
const db = require("../db");

const router = express.Router();

// Create a new member
router.post("/add", (req, res) => {
  const { title, firstName, lastName, email, mobile, dob, gender, street, city, province, country } = req.body;
  const query = "INSERT INTO members (title, firstName, lastName, email, mobile, dob, gender, street, city, province, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [title, firstName, lastName, email, mobile, dob, gender, street, city, province, country], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding member" });
    }
    res.status(200).json({ message: "Member added successfully", id: result.insertId });
  });
});

// Get all members
router.get("/", (req, res) => {
  const query = "SELECT * FROM members";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving members" });
    }
    res.status(200).json(results);
  });
});

// Get member by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM members WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving member" });
    }
    res.status(200).json(result[0]);
  });
});

// Update member
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { title, firstName, lastName, email, mobile, dob, gender, street, city, province, country } = req.body;
  const query = "UPDATE members SET title = ?, firstName = ?, lastName = ?, email = ?, mobile = ?, dob = ?, gender = ?, street = ?, city = ?, province = ?, country = ? WHERE id = ?";

  db.query(query, [title, firstName, lastName, email, mobile, dob, gender, street, city, province, country, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating member" });
    }
    res.status(200).json({ message: "Member updated successfully" });
  });
});

// Delete member
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM members WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting member" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  });
});

module.exports = router;
