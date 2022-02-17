const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    // memberNames: {
    //   type: Array,
    // },
    spaceID: {
      type: String,
      required: true
    },
    lastMessage: {
      type: String,
      required: false
    },
    lastMessageSender: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);
const Conversation = mongoose.model('CONVERSATION', ConversationSchema);
module.exports = Conversation;

//module.exports = mongoose.model("Conversation", ConversationSchema);
