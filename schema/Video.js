const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    mailID: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const LanguageSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VideoSchema = new mongoose.Schema({
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language',
      required: true,
    },
    original_video_url: {
      type: String,
      required: true,
    },
    generated_video_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewSchema = new mongoose.Schema({
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    ratings: {
      lipSync: { type: Number, min: 1, max: 5, required: true },
      translation: { type: Number, min: 1, max: 5, required: true },
      audio: { type: Number, min: 1, max: 5, required: true }, 
      overall: { type: Number, min: 1, max: 5, required: true },
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model('Language', LanguageSchema);
const Video = mongoose.model('Video', VideoSchema);
const Review = mongoose.model('Review', ReviewSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
  Language,
  Video,
  Review,
};
