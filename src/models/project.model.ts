import{model,Schema} from'mongoose';

const DOCUMENT_NAME='Project'
const COLLECTION_NAME='Projects'
interface IProjects{
    id: string
    projectName: string;
    employee: string;
    projectCode: string;
    workpackageCode: string;
    workpackageName: string;
    workItem: string;
    workItemName: string;
    workDate: string;
    workHours: number;
}

const projectsSchema: Schema = new Schema<IProjects>({
    id: { type: String, required: true },
    projectName: { type: String, required: true },
    employee: { type: String, required: true },
    projectCode: { type: String, required: true },
    workpackageCode: { type: String, required: true },
    workpackageName: { type: String, required: true },
    workItem: { type: String, required: true },
    workItemName: { type: String },
    workDate: { type: String, required: true },
    workHours: { type: Number, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default model<IProjects>(DOCUMENT_NAME, projectsSchema);