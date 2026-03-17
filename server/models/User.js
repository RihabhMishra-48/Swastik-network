const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    validate: {
      validator: function(v) {
        return /@gla\.ac\.in$/.test(v);
      },
      message: props => `${props.value} is not a valid GLA University email!`
    }
  },
  password: { type: String, required: true, minlength: 6 },
  university: { type: String, default: 'GLA University' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  universityBadge: { type: String, default: 'Student' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
