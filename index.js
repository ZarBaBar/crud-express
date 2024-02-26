const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("MANTAP");
});

app.get("/datas", (req, res) => {
  const sqlQuery = "SELECT * FROM quotes";
  db.query(sqlQuery, (error, result) => {
    // jika error
    if (error) throw error;
    // hasil data dari sql
    response(200, result, "get all data from quotes", res);
  });
});
app.get("/find/:sumber", (req, res) => {
  const sqlQuery = `SELECT * FROM quotes WHERE sumber = "${req.params.sumber}"`;

  db.query(sqlQuery, (error, result) => {
    if (error) throw error;
    response(200, result, `find sumber ${req.params.sumber}`, res);
  });
});

// POST / CREATE
app.post("/quote", (req, res) => {
  const { seriJenis, kalimat, sumber, kalimatArab, sumberDetail } = req.body;
  console.log(kalimat, sumber, kalimatArab, sumberDetail);

  const sql = `INSERT INTO quotes (seriJenis, kalimat, sumber, kalimatArab, sumberDetail) VALUES ('${seriJenis}','${kalimat}','${sumber}','${kalimatArab}','${sumberDetail}')`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "INVALID", "error", res);
    if (fields?.affectedRows) {
      const data = {
        id: fields.insertId,
        isSucces: fields.affectedRows,
      };
      response(200, data, "Data added succesfully", res);
    }
  });
});

// UPDATE / UBAH
app.put("/quote", (req, res) => {
  const { seriJenis, kalimat, sumber, kalimatArab, sumberDetail } = req.body;
  const sql = `UPDATE quotes SET kalimat = '${kalimat}', sumber = '${sumber}', kalimatArab = '${kalimatArab}', sumberDetail = '${sumberDetail}' WHERE seriJenis = '${seriJenis}'`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "INVALID", "ERROR", res);
    if (fields?.affectedRows) {
      const data = {
        message: fields.message,
        isSucces: fields.affectedRows,
      };
      response(200, data, "update data succesfuly...", res);
    } else {
      response(404, "SORRY", "SERI NOT FOUND", res);
    }
  });
});

// DELETE
app.delete("/quote", (req, res) => {
  const { seriJenis } = req.body;
  const sql = `DELETE FROM quotes WHERE seriJenis = "${seriJenis}"`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);

    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "data deleted succesfuly", res);
    } else {
      response(404, "seri not found", "error", res);
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
