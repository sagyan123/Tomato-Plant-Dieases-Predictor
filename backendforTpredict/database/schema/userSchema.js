const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png",
    },
  },
  {
    timestamps: true,
  }
);

// hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

const User = models.User || model("User", userSchema);

module.exports = User;
