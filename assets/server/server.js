const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Resultado = require("../models/Resultado");

const app = express();
app.use(express.json());
app.use(cors()); 

const MONGO_URI = "mongodb+srv://caioveiber598:W95WAVLPy1CKRdm3@kayoweiber.9thba.mongodb.net/KayoWeiber?retryWrites=true&w=majority";
//console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar com o MongoDB:", err.message));

app.post("/salvar", async (req, res) => {
  try {
    const resultado = new Resultado(req.body);
    await resultado.save();
    res.status(201).json({ message: "Dados salvos com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar os dados." });
  }
});
app.get("/resultados", async (req, res) => {
  try {
    const resultados = await Resultado.find();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os resultados" });
  }
});


app.listen(3000, () => console.log("Servidor rodando na porta 3000"));