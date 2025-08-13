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

// Normalizar fechas si vinieran como YYYY-MM-DD
const fixDate = (d) => (d && typeof d === 'string' && d.includes('/'))
  ? d.split('/').reverse().join('-')
  : d;

// -----------------------------
// POST /api/ofertas/registrar
// Crea oferta con estado='Registrada'
app.post('/api/ofertas/registrar', (req, res) => {
  console.log('Body recibido (registrar):', req.body);

  const {
    descripcion,
    lugar,
    fechaTerminoOferta,
    requisitos = null,
    cupos
  } = req.body || {};

  if (!descripcion || !lugar || !fechaTerminoOferta || !cupos) {
    return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO oferta
      (descripcion, lugar, fechaTerminoOferta, requisitos, cupos, estado)
    VALUES (?, ?, ?, ?, ?, 'Registrada')
  `;

  const values = [
    descripcion,
    lugar,
    fixDate(fechaTerminoOferta), // 'YYYY-MM-DD'
    requisitos,
    Number(cupos)
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ ok: false, error: err.code, detail: err.sqlMessage });
    }

    db.query('SELECT * FROM oferta WHERE idOferta = ?', [result.insertId], (e2, rows) => {
      if (e2) {
        console.error('MySQL:', e2.code, e2.sqlMessage);
        return res.status(500).json({ ok: false, error: e2.code, detail: e2.sqlMessage });
      }
      return res.status(201).json({
        ok: true,
        message: 'Oferta registrada',
        idOferta: result.insertId,
        oferta: rows[0]
      });
    });
  });
});

app.post('/api/registrar/oferta', (req, res) => {
  req.url = '/api/ofertas/registrar'; // redirige internamente
  app._router.handle(req, res);
});

// POST /api/ofertas/:idOferta/publicar
// Cambia estado a 'Publicada' y fija fechaRealizacion = NOW()
app.post('/api/ofertas/:idOferta/publicar', (req, res) => {
  const idOferta = Number(req.params.idOferta);
  if (!idOferta) return res.status(400).json({ ok: false, message: 'idOferta inválido' });

  const sql = `
    UPDATE oferta
       SET estado = 'Publicada',
           fechaRealizacion = NOW()
     WHERE idOferta = ?
  `;

  db.query(sql, [idOferta], (err, result) => {
    if (err) {
      console.error('MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ ok: false, error: err.code, detail: err.sqlMessage });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Oferta no encontrada' });
    }

    db.query('SELECT * FROM oferta WHERE idOferta = ?', [idOferta], (e2, rows) => {
      if (e2) {
        console.error('MySQL:', e2.code, e2.sqlMessage);
        return res.status(500).json({ ok: false, error: e2.code, detail: e2.sqlMessage });
      }
      return res.json({ ok: true, message: 'Oferta publicada', oferta: rows[0] });
    });
  });
});

// GET /api/ofertas
// Devuelve SOLO las ofertas publicadas (para "mostrar en el sistema")
app.get('/api/ofertas', (req, res) => {
  const sql = `
    SELECT * FROM oferta
     WHERE estado = 'Publicada'
     ORDER BY idOferta DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(' MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ ok: false, error: err.code, detail: err.sqlMessage });
    }
    res.status(200).json(rows);
  });
});

// -----------------------------
// GET /api/ofertas/todas  -> para panel interno del coordinador
app.get('/api/ofertas/todas', (req, res) => {
  const sql = `SELECT * FROM oferta ORDER BY idOferta DESC`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(' MySQL:', err.code, err.sqlMessage);
      return res.status(500).json({ ok: false, error: err.code, detail: err.sqlMessage });
    }
    res.status(200).json(rows);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
