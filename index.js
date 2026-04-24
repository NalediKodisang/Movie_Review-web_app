import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import dotenv from "dotenv";
dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

const uri = `mongodb://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@ac-zfc4av3-shard-00-00.t1bsyw0.mongodb.net:27017,ac-zfc4av3-shard-00-01.t1bsyw0.mongodb.net:27017,ac-zfc4av3-shard-00-02.t1bsyw0.mongodb.net:27017/?ssl=true&replicaSet=atlas-qe68pp-shard-0&authSource=admin&appName=Cluster0`;

MongoClient.connect(uri, { maxPoolSize: 50, wtimeoutMS: 2500 })
.then(async client => {
    await ReviewsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
});