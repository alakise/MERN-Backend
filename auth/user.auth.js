const User = require("../model/User.model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//jwt sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//sign up a new user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.googleId && !user.password) {
      return res.status(400).json({ error: "This user uses Google Authentication. Please sign in with Google." });
    }
    if (!(await user.isValidPassword(password, user.password))) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      if (existingUser.googleId) {
        return res.status(400).json({ error: "This email is already associated with a Google account. Please sign in with Google." });
      } else {
        return res.status(400).json({ error: "Email already exists. Please use a different email or try logging in." });
      }
    }

    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser._id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
        },
      },
    });
  } catch (err) {
    next(err);
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

exports.adminLevel = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Admin access required" 
    });
  }
  next();
};

exports.moderatorLevel = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Moderator or Admin access required" 
    });
  }
  next();
};

exports.googleLogin = async (req, res, next) => {
  const { token, clientId } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const firstname = payload['given_name'];
    const lastname = payload['family_name'];

    // Check if user exists
    let user = await User.findOne({ email });
    if (user && !user.googleId) {
      return res.status(400).json({ error: "This email is already associated with a non-Google account. Please log in with your email and password." });
    }

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        googleId,
        email,
        firstname,
        lastname
      });
    }

    // Generate JWT token
    const jwtToken = signToken(user._id);

    res.status(200).json({
      status: "success",
      token: jwtToken,
    });
  } catch (error) {
    console.error('Error in Google login:', error);
    res.status(401).json({ error: 'Invalid Google credentials' });
  }
};


