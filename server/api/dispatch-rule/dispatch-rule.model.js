'use strict';

import mongoose, {Schema} from 'mongoose';

var DispatchRuleSchema = new Schema({
  mdph:           { type: Schema.Types.ObjectId, ref: 'Mdph', required: true },
  createdAt:      { type: Date },
  updatedAt:      { type: Date },
  commune: {
    nom: String,
    codePostal: String
  },
  secteur:  {
    enfant: { type: Schema.Types.ObjectId, ref: 'Secteur' },
    adulte: { type: Schema.Types.ObjectId, ref: 'Secteur' }
  }
});

export default mongoose.model('DispatchRule', DispatchRuleSchema);
