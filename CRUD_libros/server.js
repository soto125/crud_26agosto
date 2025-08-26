const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Datos 
let usuarios = [
  { id: 1, nombre: "Juan", correo: "juan@ejemplo.com" },
  { id: 2, nombre: "Ana", correo: "ana@ejemplo.com" }
];

// GET (lista)
app.get("/usuarios", (req, res) => {
  console.log("GET /usuarios - Enviando lista de usuarios");
  res.json(usuarios);
});

// POST crear 
app.post("/usuarios", (req, res) => {
 console.log("POST /usuarios entró al servidor");
  console.log("Datos recibidos:", req.body);

  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    console.log("POST /usuarios error: Nombre y correo obligatorios");
    return res.status(400).json({ error: "Nombre y correo son obligatorios" });
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    nombre,
    correo
  };

  usuarios.push(nuevoUsuario);

  console.log("Usuario creado:", nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// PUT actualizar 
app.put("/usuarios/:id", (req, res) => {
  console.log(`PUT /usuarios/${req.params.id} recibido con datos:`, req.body);

  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) {
    console.log(`PUT /usuarios/${req.params.id} error: Usuario no encontrado`);
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { nombre, correo } = req.body;
  usuario.nombre = nombre || usuario.nombre;
  usuario.correo = correo || usuario.correo;

  console.log(`Usuario actualizado:`, usuario);
  res.json(usuario);
});

// DELETE usuario
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /usuarios/${id} recibido`);

  const existe = usuarios.some(u => u.id === id);

  if (!existe) {
    console.log(`DELETE /usuarios/${id} error: Usuario no encontrado`);
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  usuarios = usuarios.filter(u => u.id !== id);

  console.log(`Usuario con id ${id} eliminado`);
  res.json({ mensaje: "Usuario eliminado correctamente" });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
