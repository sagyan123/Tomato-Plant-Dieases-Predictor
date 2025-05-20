const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  const url = process.env.MONGO_URI;
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = connectToMongoDB;
