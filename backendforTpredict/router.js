const router = require("express").Router();

router.use("/user", require("./routes/userRoute.js"));

module.exports = router;
