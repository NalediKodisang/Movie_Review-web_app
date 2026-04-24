let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) return;
    users = await conn.db("movies").collection("users");
    console.log("UsersDAO: connected to 'users' collection");
  }

  static async getUserByUsername(username) {
    return await users.findOne({ username });
  }

  static async addUser(username, hashedPassword) {
    return await users.insertOne({
      username,
      password: hashedPassword,
      date: new Date()
    });
  }
}