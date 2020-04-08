const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
  user: {
    type: objectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: objectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: 'Неверный формат номера телефона.',
      },
    ],
  },

  address: {
    type: String,
    required: true,
  },
});

module.exports = connection.model('Order', orderSchema);
