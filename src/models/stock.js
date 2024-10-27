 import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  date: Date,
  symbol: String,
  series: String,
  prev_close: Number,
  open: Number,
  high: Number,
  low: Number,
  last: Number,
  close: Number,
  vwap: Number,
  volume: Number,
  turnover: Number,
  trades: Number,
  deliverable: Number,
  percent_deliverable: Number,
});

export const Stock = mongoose.model('stock',stockSchema)
