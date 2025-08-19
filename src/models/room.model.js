const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerNight: { type: Number, required: true },
  roomType: { type: String, enum: ['single', 'double', 'suite', 'deluxe'], required: true },
  amenities: [String],
  available: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Pre-save hook to lowercase roomType
roomSchema.pre('save', function(next) {
  if (this.roomType) {
    this.roomType = this.roomType.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
