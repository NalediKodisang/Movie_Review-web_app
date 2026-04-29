let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) return;
    try {
      users = await conn.db("movies").collection("users");
      console.log("UsersDAO: connected to 'users' collection");
    } catch (e) {
      console.error("UsersDAO injectDB failed:", e);
    }
  }

  // Finds a user by their username
  // Used during login to check if user exists
  static async getUserByUsername(username) {
    return await users.findOne({ username });
  }

  // Creates a new user with a hashed password
  // role defaults to "user" unless we say "admin"
  // This is how we control who is admin and who isnt
  static async addUser(username, hashedPassword, role = "user") {
    return await users.insertOne({
      username,
      password: hashedPassword,
      role, // "user" or "admin"
      date: new Date()
    });
  }

  // Gets all users - used in admin dashboard
  static async getAllUsers() {
    return await users.find({}).toArray();
  }
}