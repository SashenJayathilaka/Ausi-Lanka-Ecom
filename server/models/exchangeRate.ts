import mongoose, { Schema, Document } from "mongoose";

export interface IExchangeRate extends Document {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

const exchangeRateSchema: Schema = new Schema({
  fromCurrency: { type: String, required: true, default: "AUD" },
  toCurrency: { type: String, required: true, default: "LKR" },
  rate: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ExchangeRate = mongoose.model<IExchangeRate>(
  "ExchangeRate",
  exchangeRateSchema
);

export default ExchangeRate;
