var express = require('express');
const Link = require('../models/link');
var router = express.Router();


/*statistica*/
router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.send('stats', resultado.dataValues);
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

function generatorCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


/*POST */
router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generatorCode();

  const resultado = await Link.create({
    url,
    code
  })
  res.render('stats', resultado.dataValues);
});

/*URL ENCURTADA*/
router.get('/:code', async (req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();

  res.redirect(resultado.url);
});


module.exports = router;
