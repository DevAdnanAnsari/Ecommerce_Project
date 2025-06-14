const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { encryptString } = require("../helper/security");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  // async postSignup(req, res) {
  //   let { name, email, password, cPassword } = req.body;
  //   let error = {};
  //   if (!name || !email || !password || !cPassword) {
  //     error = {
  //       ...error,
  //       name: "Filed must not be empty",
  //       email: "Filed must not be empty",
  //       password: "Filed must not be empty",
  //       cPassword: "Filed must not be empty",
  //     };
  //     return res.json({ error });
  //   }

  //   if (name.length < 3 || name.length > 25) {
  //     error = { ...error, name: "Name must be 3-25 charecter" };
  //     return res.json({ error });
  //   } else {
  //     if (validateEmail(email)) {
  //       name = toTitleCase(name);
  //       if ((password.length > 255) | (password.length < 8)) {
  //         error = {
  //           ...error,
  //           password: "Password must be 8 charecter",
  //           name: "",
  //           email: "",
  //         };
  //         return res.json({ error });
  //       } else {
  //         // If Email & Number exists in Database then:
  //         try {
  //           password = bcrypt.hashSync(password, 10);
  //           const data = await userModel.findOne({ email: email });
  //           if (data) {
  //             error = {
  //               ...error,
  //               password: "",
  //               name: "",
  //               email: "Email already exists",
  //             };
  //             return res.json({ error });
  //           } else {
  //             let newUser = new userModel({
  //               name,
  //               email,
  //               password,
  //               // ========= Here role 1 for admin signup role 0 for customer signup =========
  //               userRole: 1, // Field Name change to userRole from role
  //             });
  //             newUser
  //               .save()
  //               .then((data) => {
  //                 return res.json({
  //                   success: "Account create successfully. Please login",
  //                 });
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //               });
  //           }
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //     } else {
  //       error = {
  //         ...error,
  //         password: "",
  //         name: "",
  //         email: "Email is not valid",
  //       };
  //       return res.json({ error });
  //     }
  //   }
  // }

  async postSignup(req, res) {
  let { name, email, password, cPassword } = req.body;
  let error = {};

  // Validation: Required Fields
  if (!name || !email || !password || !cPassword) {
    error = {
      name: "Field must not be empty",
      email: "Field must not be empty",
      password: "Field must not be empty",
      cPassword: "Field must not be empty",
    };
    return res.json({ error });
  }

  // Validation: Name length
  if (name.length < 3 || name.length > 25) {
    error = { name: "Name must be 3-25 characters" };
    return res.json({ error });
  }

  // Validation: Email format
  if (!validateEmail(email)) {
    error = {
      name: "",
      email: "Email is not valid",
      password: "",
    };
    return res.json({ error });
  }

  // Validation: Password length
  if (password.length < 8 || password.length > 255) {
    error = {
      name: "",
      email: "",
      password: "Password must be at least 8 characters",
    };
    return res.json({ error });
  }

  // Email exists check and password encryption
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      error = {
        name: "",
        email: "Email already exists",
        password: "",
      };
      return res.json({ error });
    }

    // Format name
    name = toTitleCase(name);

    // Encrypt password
    const encryptedPassword = encryptString(password);

    // Save user
    const newUser = new userModel({
      name,
      email,
      password: encryptedPassword,
      userRole: 1, // role 1 = admin
    });

    await newUser.save();

    return res.json({
      success: "Account created successfully. Please login",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



  /* User Login/Signin controller  */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole },
            JWT_SECRET
          );
          const encode = jwt.verify(token, JWT_SECRET);
          return res.json({
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const authController = new Auth();
module.exports = authController;
