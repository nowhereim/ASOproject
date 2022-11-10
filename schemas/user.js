var mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    profileImage: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    gender: {
        type: Boolean, // 남: 0, 여: 1
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // data 생성 당시의 시간
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);