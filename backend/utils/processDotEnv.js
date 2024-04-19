import dotenv from 'dotenv';
import path from 'path';

const pathConfig = path.resolve("backend", "config", 'uat.env');
dotenv.config({path:pathConfig});


const processEnvironmentVariable = ()=>{
    return process.env; // return object
};

const processEnvVar = processEnvironmentVariable();
export default processEnvVar;