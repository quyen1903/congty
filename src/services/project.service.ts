import Project from '../models/project.model';

class ProjectService{
    static async getAllData(){
        return Project.find({})
    }
    static async addData(payload: {[key: string]: any}){
        // Destructure all other fields except workHours
        const {
            workHours,
            ...restPayload
        } = payload;

        // Convert workHours to a number
        const processedPayload = {
            ...restPayload,
            workHours: Number(workHours),
        };
        return await Project.create(processedPayload);
    }

    static async updateData(projectId: string, payload: {[key: string]: any}) {
        console.log('this is update payload', payload);
        
        const {
            id,
            projectName,
            employee,
            projectCode,
            workpackageCode,
            workpackageName,
            workItem,
            workItemName,
            workDate,
            workHours,
        } = payload;
    
        // Shorthand for properties where key and value have the same name
        return await Project.findOneAndUpdate(
            { id: projectId },
            {
                id,
                projectName,
                employee,
                projectCode,
                workpackageCode,
                workpackageName,
                workItem,
                workItemName,
                workDate,
                workHours,
            },
            { new: true }
        );
    }

    static deleteData(projectId: string){
        return Project.findOneAndDelete({id:projectId}) 
    }
    
}

export default ProjectService