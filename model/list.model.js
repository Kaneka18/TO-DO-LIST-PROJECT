const mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: "Required"
    },
    dueDate: {
        type: String,
        required: "Required"
    },
    setAsImportant: {
        type: Boolean,
        required: "Required"
    },
    taskId: {
        type: Number,
        required: "Required"
    }
});

mongoose.model("lists", listSchema);