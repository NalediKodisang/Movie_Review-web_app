import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import dotenv from "dotenv";
dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.t1bsyw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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