const { Schema, model, models } = require("mongoose");

const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
    },
    result: [
      {
        confidence: {
          type: Number,
          required: true,
        },
        class: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model("Post", postSchema);

module.exports = Post;
