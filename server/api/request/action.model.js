'use strict';

import mongoose, {Schema} from 'mongoose';

var ActionSchema = new Schema({
  mdph:           { type: String },
  user:           { type: Schema.Types.ObjectId, ref: 'User' },
  action:         { type: String },
  request:        { type: Schema.Types.ObjectId, ref: 'Request' },
  date:           { type: Date },
  params:         Schema.Types.Mixed
});

export default mongoose.model('Action', ActionSchema);
