import express from 'express';
const app = express();

app.listen(3000, () => {
  console.log('¡El servidor de VetSync está levantando perfecto en el puerto 3000!');
});