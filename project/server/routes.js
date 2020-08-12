
var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */



function getHomepage(req, res) {
  var query = `
  Select n.company, d.revenue,d.Revenue_Growth, d.Gross_Profit from data_2018 d JOIN company n
on d.ticker = n.ticker
ORDER BY revenue DESC
LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

function getRecs(req, res) {
  var query = `
  SELECT Distinct a.company, b.date,b.high,b.low
  From (Select n.ticker, n.company, d.revenue from data_2018 d JOIN company n
  on d.ticker = n.ticker
  ORDER BY revenue DESC
  LIMIT 10) a join nasdaq_historical_prices_daily b
  ON a.ticker = b.ticker
  Order by date DESC
  Limit 5;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

function need(req, res) {
  var query = `
  SELECT "2020-02-03";
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

function getRecStock(req, res) {
  var inputStock = req.params.stock;
  var query = `
    SELECT f1.ticker, c.company, c.sector, d.open, d.high, d.date
    From data_2018 f1 JOIN Company c ON c.ticker = f1.ticker 
    	JOIN daily_Prices d ON d.ticker = c.ticker 
    	JOIN daily_max m ON d.ticker = m.ticker AND d.date = m.date
    	JOIN avgPerSector ap ON c.sector = ap.sector 
    WHERE c.sector = (SELECT sector FROM Company C2 WHERE C2.ticker = '${inputStock}') 
      AND f1.Gross_Profit >= ap.gross_profit
      AND f1.Gross_Profit >= (SELECT Gross_Profit FROM 2017_Financial_Data F3 WHERE F3.ticker = '${inputStock}') 
      AND f1.Cost_Revenue <= ap.cost_revenue
      AND f1.Cost_Revenue <= (SELECT Cost_Revenue FROM 2017_Financial_Data F5 WHERE F5.ticker = '${inputStock}')
      AND f1.ticker <> '${inputStock}'
    ORDER BY c.company
    LIMIT 20;
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksRiskFirst(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON m.ticker = d.ticker AND m.date = d.date
    WHERE f.cost_revenue < (
    SELECT AVG(cost_revenue)
    FROM 2017_Financial_Data) AND f.revenue_growth >= (
    Select AVG(revenue_growth) as avg_rvn
    From data_2018) AND f.Revenue_Growth >= (
    Select Revenue_Growth * 1.2 
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.open < 50
    ORDER BY d.high
    LIMIT 20;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksRiskSecond(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON m.ticker = d.ticker AND m.date = d.date
    WHERE f.cost_revenue < (
    SELECT AVG(cost_revenue)
    FROM 2017_Financial_Data) AND f.revenue_growth >= (
    Select AVG(revenue_growth) as avg_rvn
    From data_2018) AND f.Revenue_Growth >= (
    Select Revenue_Growth * 1.2 
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.high >= 50 AND d.high <= 100
    ORDER BY d.high;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksRiskThird(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON m.ticker = d.ticker AND m.date = d.date
    WHERE f.cost_revenue < (
    SELECT AVG(cost_revenue)
    FROM 2017_Financial_Data) AND f.revenue_growth >= (
    Select AVG(revenue_growth) as avg_rvn
    From data_2018) AND f.Revenue_Growth >= (
    Select Revenue_Growth * 1.2 
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.high > 100
    ORDER BY d.high;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksStableFirst(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON d.ticker = m.ticker AND d.date = m.date
    WHERE f.revenue >= (
    SELECT AVG(revenue)
    FROM 2017_Financial_Data) AND f.revenue >= (
    Select AVG(revenue) as avg_rvn
    From data_2018) AND f.gross_profit >= (
    Select gross_profit * 1.1
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.open < 50
    ORDER BY d.high DESC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksStableSecond(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON d.ticker = m.ticker AND d.date = m.date
    WHERE f.revenue >= (
    SELECT AVG(revenue)
    FROM 2017_Financial_Data) AND f.revenue >= (
    Select AVG(revenue) as avg_rvn
    From data_2018) AND f.gross_profit >= (
    Select gross_profit * 1.1
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.open >= 50 AND d.open <= 100
    ORDER BY d.high DESC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function bestStocksStableThird(req, res) {
  var query = `
    Select c.ticker, c.company, c.sector, d.open, d.high
    From Company c JOIN data_2018 f ON c.ticker = f.ticker JOIN 2017_Financial_Data f2 ON f.ticker = f2.ticker JOIN daily_Prices d ON d.ticker = f.ticker JOIN daily_max m ON d.ticker = m.ticker AND d.date = m.date
    WHERE f.revenue >= (
    SELECT AVG(revenue)
    FROM 2017_Financial_Data) AND f.revenue >= (
    Select AVG(revenue) as avg_rvn
    From data_2018) AND f.gross_profit >= (
    Select gross_profit * 1.1
    FROM 2017_Financial_Data f4
    WHERE f4.ticker = f.ticker) AND d.open > 100
    ORDER BY d.high DESC
    LIMIT 20;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
// The exported functions, which can be accessed in index.js.
module.exports = {
	getHomepage: getHomepage,
	getRecs:getRecs,
  need:need,
  getRecStock: getRecStock,
  bestStocksRiskFirst: bestStocksRiskFirst,
  bestStocksRiskSecond: bestStocksRiskSecond,
  bestStocksRiskThird: bestStocksRiskThird,
  bestStocksStableFirst: bestStocksStableFirst,
  bestStocksStableSecond: bestStocksStableSecond,
  bestStocksStableThird: bestStocksStableThird
}
