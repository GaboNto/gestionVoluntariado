const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  port: 3310,
  user: 'root',
  password: '',
  database: 'gestion_voluntariado'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conexión a MySQL exitosa');
  }
});

// Ruta para guardar una oferta (POST)
app.post('/api/registrar/oferta', (req, res) => {
  const  oferta =  { descripcion, lugar, fecha, cupos, requisitos, fecha_limite } = req.body;

  const query = `INSERT INTO oferta (descripcion, lugar, fecha_realizacion, cupos,
  requisitos_especificos, fecha_limite) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, oferta, (result) => {
      res.status(200).json({ message: 'Oferta guardada exitosamente', id: result.insertId });
  });
});

// Ruta para obtener todas las ofertas (GET)
app.get('/api/ofertas', (req, res) => {
  const sql = 'SELECT * FROM oferta ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener ofertas:', err);
      res.status(500).json({ error: 'Error al obtener ofertas' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
