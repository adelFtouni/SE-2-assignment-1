
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join(__dirname,'../../.env')})

export default {
    secret : process.env.secret || 'not valid',
    logsDir: process.env.logsDir || './logs',
    isDev: process.env.NODE_ENV === 'development',
    
}