const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA = {
  rgs: "./data/rgs.json",
  policia: "./data/policia.json",
  veiculos: "./data/veiculos.json"
};

function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    fs.writeFileSync(file, "{}");
    return {};
  }
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ================= ROTAS ================= */

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Buscar RG
app.get("/api/rg/:id", (req, res) => {
  const rgs = load(DATA.rgs);
  const rg = rgs[req.params.id];
  if (!rg) return res.json({ erro: "RG não encontrado" });
  res.json(rg);
});

// Antecedentes
app.get("/api/antecedentes/:id", (req, res) => {
  const policia = load(DATA.policia);
  res.json(policia[req.params.id] || []);
});

// Registrar veículo
app.post("/api/veiculo", (req, res) => {
  const veiculos = load(DATA.veiculos);
  const { placa, modelo, dono } = req.body;

  if (!placa || !modelo || !dono)
    return res.json({ erro: "Dados incompletos" });

  veiculos[placa] = {
    placa,
    modelo,
    dono,
    status: "REGULAR"
  };

  save(DATA.veiculos, veiculos);
  res.json({ sucesso: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚓 Sistema policial online");
});

