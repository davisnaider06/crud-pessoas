const { criarApp } = require('./app');

const PORT = process.env.PORT || 3000;

criarApp().listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
