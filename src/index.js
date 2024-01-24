import dotenv from 'dotenv'
import ConnectDB from './db/Connect.js'
import {app} from './app.js'



dotenv.config({
    path: './.env'
})


ConnectDB()
.then(() => {
    app.listen(process.env.PORT_NO || 5000, () => {
        console.log(`PORT is running on ${process.env.PORT_NO}`);
    })
})
.catch((error) => {
    console.log('Mongodb connection failed ....');
})