const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const secretKey = '6LfGD-EpAAAAACWco8HdMAbF2gOohWHNELGdiZH1';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', async (req, res) => {
  const formData = req.body;
  const recaptchaResponse = req.body['g-recaptcha-response'];

  if (!recaptchaResponse) {
    return res.status(400).send('reCAPTCHA validation failed.');
  }

  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  try {
    const response = await fetch(verificationURL, { method: 'POST' });
    const verificationResult = await response.json();

    if (!verificationResult.success) {
      return res.status(400).send('Failed reCAPTCHA verification.');
    }

    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка при чтении файла базы данных.');
      }

      let database = JSON.parse(data);
      database.push(formData);
      fs.writeFile('db.json', JSON.stringify(database, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка при записи в файл базы данных.');
        }
        res.redirect('index.html');
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при проверке reCAPTCHA.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
