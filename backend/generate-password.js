const bcrypt = require("bcryptjs");

const password = " ";

bcrypt.hash(password, 12).then((hash) => {
  console.log("\n====================================");
  console.log("Password :", password);
  console.log("Hash     :", hash);
  console.log("====================================\n");
  process.exit();
});