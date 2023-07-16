import mongoose from "mongoose";
let DB: any = process.env.DB_URL;
mongoose.set("strictQuery", false);
mongoose.connect(DB);
const con = mongoose.connection;
export default con;