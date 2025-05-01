import config from "../config";
import winston from "winston";   


// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly:6
// }
 //nst logsDir = config.logsDir
 //nst isDev = config.isDev
const {logsDir, isDev}= config;
const logFileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({stack:true})
)

const logConsoleFormat = winston.format.combine(
    winston.format.colorize(),
   // winston.format.simple(),
    winston.format.timestamp({format:'HH:mm:ss'}),
    winston.format.splat(),
    winston.format.printf(({timestamp,level,message,stack})=>{
        return `[${timestamp}] ${level}: ${message} ${stack ? stack : ''}`
    })
)
const logger = winston.createLogger({
level:'info',
//wen bedak thetli l data
transports:[
    //kel ma a3mel log wrjini ye bl console
    // new winston.transports.Console({format:logConsoleFormat}),
    new winston.transports.File({filename:'logs/error.log',level:'error',format:logFileFormat,dirname:logsDir}),
    new winston.transports.File({filename:'logs/all.log',format:logFileFormat, dirname:logsDir}),
],
exceptionHandlers:[
    new winston.transports.File({filename:'logs/exception.log',format:logFileFormat,dirname:logsDir}),
]

})

if(isDev){
    logger.add(new winston.transports.Console({format:logConsoleFormat}))
    logger.level='debug'
}

export default logger