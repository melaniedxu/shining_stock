const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */




app.get('/homepage', routes.getHomepage);
//app.get('/homepage/second/', routes.getHomepageSecond);

app.get('/homepage/second',routes.getRecs);




/* ---- (Recommendations) ---- */
app.get('/recommendations', routes.need);



app.get('/recommendations/:stock', routes.getRecStock);



app.get('/beststocks/risk-taking-less', routes.bestStocksRiskFirst);

app.get('/beststocks/risk-taking-between', routes.bestStocksRiskSecond);

app.get('/beststocks/risk-taking-more', routes.bestStocksRiskThird);

app.get('/beststocks/stable-seeking-less', routes.bestStocksStableFirst);

app.get('/beststocks/stable-seeking-between', routes.bestStocksStableSecond);

app.get('/beststocks/stable-seeking-more', routes.bestStocksStableThird);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
