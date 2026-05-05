const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;               // Можна змінити на будь-який вільний порт

// ------------------ Підготовка папок ------------------
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);     // створює папку, якщо її немає

// ------------------ Налаштування multer ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// ------------------ Middleware ------------------
app.use(cors({ origin: '*' }));           // дозволяє всі джерела (для розробки)
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// ------------------ Робота з JSON базою ------------------
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  fs.writeJsonSync(dbPath, { inventory: [] });
}

const readDB = () => fs.readJsonSync(dbPath);
const writeDB = (data) => fs.writeJsonSync(dbPath, data);

// ------------------ API маршрути ------------------
// Отримати всі позиції
app.get('/inventory', (req, res) => {
  const db = readDB();
  res.json(db.inventory);
});

// Отримати одну позицію за ID
app.get('/inventory/:id', (req, res) => {
  const db = readDB();
  const item = db.inventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Отримати фото
app.get('/inventory/:id/photo', (req, res) => {
  const db = readDB();
  const item = db.inventory.find(i => i.id === req.params.id);
  if (!item || !item.photoFilename) return res.status(404).send('Photo not found');
  const photoPath = path.join(uploadDir, item.photoFilename);
  fs.existsSync(photoPath) ? res.sendFile(photoPath) : res.status(404).send('File missing');
});

// Створити нову позицію (з фото)
app.post('/register', upload.single('photo'), (req, res) => {
  const { inventory_name, description } = req.body;
  if (!inventory_name) return res.status(400).json({ error: 'inventory_name is required' });
  const db = readDB();
  const newItem = {
    id: uuidv4(),
    inventory_name,
    description: description || '',
    photoFilename: req.file ? req.file.filename : null,
  };
  db.inventory.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

// Оновити текстові поля (назва, опис)
app.put('/inventory/:id', (req, res) => {
  const { inventory_name, description } = req.body;
  const db = readDB();
  const index = db.inventory.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  if (inventory_name !== undefined) db.inventory[index].inventory_name = inventory_name;
  if (description !== undefined) db.inventory[index].description = description;
  writeDB(db);
  res.json(db.inventory[index]);
});

// Оновити фото
app.put('/inventory/:id/photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const db = readDB();
  const index = db.inventory.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  // видалити старе фото
  const oldPhoto = db.inventory[index].photoFilename;
  if (oldPhoto) {
    const oldPath = path.join(uploadDir, oldPhoto);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  db.inventory[index].photoFilename = req.file.filename;
  writeDB(db);
  res.json(db.inventory[index]);
});

// Видалити позицію
app.delete('/inventory/:id', (req, res) => {
  const db = readDB();
  const index = db.inventory.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  const photo = db.inventory[index].photoFilename;
  if (photo) {
    const photoPath = path.join(uploadDir, photo);
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
  }
  db.inventory.splice(index, 1);
  writeDB(db);
  res.status(204).send();
});

// ------------------ Запуск сервера ------------------
app.listen(PORT, () => {
  console.log(`Бекенд запущено на http://localhost:${PORT}`);
});