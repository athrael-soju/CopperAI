import { model, models, Document, Schema } from 'mongoose';

export interface PreferenceDoc extends Document {
  activity: string;
  userEmail: string;
}

const namespaceSchema = new Schema<PreferenceDoc>({
  activity: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

export const Preference = models?.Preference
  ? model<PreferenceDoc>('Preference')
  : model<PreferenceDoc>('Preference', namespaceSchema);
