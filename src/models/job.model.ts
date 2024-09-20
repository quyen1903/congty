import{model,Schema, Types} from'mongoose';

interface IJobs{
    company: string;
    position: string;
    status: 'interview'|'declined'| 'pending';
    createdBy: Types.ObjectId;
    jobType:'full-time'| 'part-time'| 'remote'| 'internship';
    jobLocation: string;

}

const JobSchema: Schema = new Schema<IJobs>(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IJobs>('Job', JobSchema);
