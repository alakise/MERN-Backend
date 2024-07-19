const User = require("./../model/User.model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//jwt sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//sign up a new user
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    
    //assign token to user
    const token = signToken(newUser._id);

    //hide password before returning user's details
    newUser.password = undefined;

    //send back response
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    if (err) return next(err);
  }
};

//log in a user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if user provided email and password
    if (!email || !password) {
      res.status(401).json("Please provide email and password");
      return next(new Error("Please provide email and password"));
    }
    //check if user exist in the database and compare passwords
    const user = await User.findOne({ email });
    if (!user && !(await user.isValidPassword(password, user.password))) {
      res.status(400).json("Incorrect email or password");
      return next(new Error("Incorrect email or password"));
    }
     //assign toke to user
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    throw err;
  }
};

//create an authenticate middleware that will protect routes
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    //Check if token was passed in the header and then retrieve
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(res.status(401).json("Unauthorized"));
    }
    //verify if token has been altered || if token has expired
    const decodedPayload = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    //check if user still exist using the token payload
    const currentUser = await User.findById(decodedPayload.id);
    if (!currentUser)
      return next(res.status(401).json("User with this token does not exist"));

    //Assign user to the req.user object
    req.user = currentUser;
    next();
  } catch (err) {
    res.json(err);
  }
};