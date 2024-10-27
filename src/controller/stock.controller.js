 import { Stock } from '../models/stock.js';
 import csv from 'csv-parser'
 import fs from 'fs'
 

export const uploadCSV = async (req, res) => {

  if (!req.file || req.file.mimetype !== 'text/csv') {
    return res.status(400).json({ message: 'Please upload a valid CSV file.' });
  }
  const results = [];
  let successCount = 0;
  let failureCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      try {
        if (validateRow(row)) {
          const stockData = {
            date: new Date(row.Date),
            symbol: row.Symbol,
            series: row.Series,
            prev_close: parseFloat(row['Prev Close']),
            open: parseFloat(row.Open),
            high: parseFloat(row.High),
            low: parseFloat(row.Low),
            last: parseFloat(row.Last),
            close: parseFloat(row.Close),
            vwap: parseFloat(row.VWAP),
            volume: parseInt(row.Volume, 10),
            turnover: parseFloat(row.Turnover),
            trades: parseInt(row.Trades, 10) || 0, 
            deliverable: parseInt(row.Deliverable, 10) || 0, 
            percent_deliverable: parseFloat(row['%Deliverable']) || 0.0, 
          };

          
          const stock = new Stock(stockData);
          stock.save();
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        failureCount++;
      }
    })
    .on('end', () => {
      fs.unlinkSync(req.file.path);
      res.json({
        message: 'Stock Data Processed Successfully',
        successCount,
        failureCount
      });
    });
};

export function validateRow(row) {
  return !isNaN(Date.parse(row.Date)) && !isNaN(parseFloat(row['Prev Close']));
}

 
// export const getHighestVolume = async (req, res) => {
//   try {
//     const { start_date, end_date, symbol } = req.query;
    
//     const startDate = new Date(start_date);
//     const endDate = new Date(end_date);

//     //  if date is valid
//     if (isNaN(startDate) || isNaN(endDate)) {
//       return res.status(400).json({ message: "Invalid date format. Please provide valid start_date and end_date." });
//     }

//     const filter = {
//       date: { $gte: startDate, $lte: endDate }
//     };
//     if (symbol) filter.symbol = symbol;

//     const data = await Stock.find(filter).sort({ volume: -1 }).limit(1);
//     res.json(data);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred while retrieving data." });
//   }
// };



export const getHighestVolume = async (req, res) => {
  try {
    const { start_date, end_date, symbol } = req.query;
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Validate dates
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: "Invalid date format. Please provide valid start_date and end_date." });
    }

    const filter = {
      date: { $gte: startDate, $lte: endDate }
    };
    if (symbol) filter.symbol = symbol;

    // Find the highest volume entry
    const data = await Stock.find(filter).sort({ volume: -1 }).limit(1);

    // Check if data exists
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for the specified criteria." });
    }

    // Extract required fields for the response
    const highestVolumeRecord = data[0];
    res.json({
      highest_volume: {
        date: highestVolumeRecord.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        symbol: highestVolumeRecord.symbol,
        volume: highestVolumeRecord.volume
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving data." });
  }
};


 
export const getAverageClose = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;
  const filter = { date: { $gte: new Date(start_date), $lte: new Date(end_date) }, symbol };

  const avgClose = await Stock.aggregate([
    { $match: filter },
    { $group: { _id: null, averageClose: { $avg: "$close" } } },
  ]);
  res.json(avgClose[0]?.averageClose || 0);
};

// API to get average VWAP
export const getAverageVWAP = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;
  const filter = { date: { $gte: new Date(start_date), $lte: new Date(end_date) }, symbol };

  const avgVWAP = await Stock.aggregate([
    { $match: filter },
    { $group: { _id: null, averageVWAP: { $avg: "$vwap" } } },
  ]);
  res.json(avgVWAP[0]?.averageVWAP || 0);
};

 
