import {app} from './src/app';
import config from './src/configs/config.mongodb';
const port = config.app.port

const server = app.listen(port,()=>{
    console.log(`Server listerning from port ${port}`)
})