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
  port: 3306,
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

// Utilidad opcional para normalizar fechas si vinieran como DD/MM/YYYY
const fixDate = (d) => (d && typeof d === 'string' && d.includes('/'))
  ? d.split('/').reverse().join('-')
  : d;

// Handler común para crear oferta (sin enviar `estado`)
function crearOferta(req, res) {
  console.log('Body recibido:', req.body);

  const {
    descripcion,
    lugar,
    fecha_realizacion,
    cupos,
    requisitos_especificos,
    fecha_limite
  } = req.body;

  const sql = `
    INSERT INTO oferta
      (descripcion, lugar, fecha_realizacion, cupos, requisitos_especificos, fecha_limite)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    descripcion,
    lugar,
    fixDate(fecha_realizacion),            // 'YYYY-MM-DD'
    Number(cupos),
    (requisitos_especificos ?? null),
    fixDate(fecha_limite)                  // 'YYYY-MM-DD'
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ error: err.code, detail: err.sqlMessage });
    }
    res.status(200).json({ ok: true, message: 'Oferta guardada exitosamente', id: result.insertId });
  });
}

// Rutas para guardar una oferta (POST)
// Recomendada:
app.post('/api/ofertas', crearOferta);
// Alias para compatibilidad con tu código anterior:
app.post('/api/registrar/oferta', crearOferta);

// Ruta para obtener todas las ofertas (GET)
app.get('/api/ofertas', (req, res) => {
  const sql = 'SELECT * FROM oferta ORDER BY id DESC';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(' MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ error: err.code, detail: err.sqlMessage });
    }
    res.status(200).json(rows);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
