const mongoose = require("mongoose");

const ResultadoSchema = new mongoose.Schema({
  pesosCheios: [Number],
  volumes: [Number],
  volumeMedio: Number,
  menorVolume: Number,
  maiorVolume: Number,
  pesoLata: Number,
  pesoTampa: Number,
  densidade: Number,
  limiar: Number,
  quantidade: Number,
  data: {
    type: Date,
    default: Date.now // Armazena em UTC
  }
});

ResultadoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    
    // Formata para Brasília na serialização
    ret.data = doc.data.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour12: false
    });
    
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Resultado", ResultadoSchema);
