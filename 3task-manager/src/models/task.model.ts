import{model,Schema,Types} from'mongoose';

interface ITask{
    name: string;
    completed: boolean;
}

const TaskSchema: Schema = new Schema<ITask>({
    name: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true
}
)

export default model('Task', TaskSchema)
