import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Token from "../models/Token.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import Order from "../models/Order.js";
dotenv.config();
const confirmEmail = asyncHandler(async (req, res) => {
  const token = await Token.findOne({ token: req.params.token });
  if (!token) {
    res.status(400);
    throw new Error(
      "Your verification link may have expired. Please click on resend for verify your Email"
    );
  }
  const user = await User.findOne({
    _id: token._userId,
    email: req.params.email,
  });
  if (!user) {
    res.status(401);
    throw new Error(
      "We were unable to find a user for this verification. Please SignUp!"
    );
  } else if (user.isVerified) {
    res
      .status(200)
      .json({ message: "User has been already verified. Please Login" });
  } else {
    user.isVerified = true;
    const userSave = await user.save();
    if (userSave) {
      // res.json({
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   isAdmin: user.isAdmin,
      //   token: generateToken(user._id),
      // });
      res.status(200).json({ message: "Verified Successfully,Please login" });
    } else {
      res.status("400");
      throw new Error("Invalid user data");
    }
  }
}); //done

const resendLink = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // user is not found into database
  if (!user) {
    throw new Error(
      "We were unable to find a user with that email. Make sure your Email is correct!"
    );
    return;
  }
  // user has been already verified
  else if (user.isVerified) {
    return res.status(200).json({
      message: "This account has been already verified. Please log in.",
    });
  }
  // send verification link
  else {
    // generate token and save
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const tokenSave = token.save();
    if (!tokenSave) {
      res.status(500);
      throw new Error("Error encountered!!");
    }

    // Send email (use credintials of SendGrid)

    sgMail.setApiKey(
process.env.SENDGRID_API_KEY
      
    );
    const msg = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Account Verification Link",
      text:
        "Hello " +
        user.name +
        ",\n\n" +
        "Please verify your account by clicking the link: \n"+process.env.URL +"confirmation/" +
        user.email +
        "/" +
        token.token +
        "\n\nThank You!\n",
    };
    sgMail.send(msg).then(
      () => {
        res.status(200).json({
          message: `A verification email has been sent to ${user.email}. It will be expire after one day. If you did not get verification Email click on resend token.`,
        });
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
        return res.status(500).json({
          message:
            "Technical Issue!, Please click on resend for verify your Email.",
        });
      }
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email
  });
  
  if (!user ) {
    res.status(401);
    throw new Error("Invalid email or password");
  }else if(!(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
  }
  else if (!user.isVerified) {
    res.status(401);
    throw new Error("Your email is not verified, Please verify");
  } else {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
});
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, isAdmin } = req.user;
  const updateUser = await User.findById(_id);
  updateUser.updatedAt = new Date();
  await updateUser.save();
  res.json({
    _id,
    name,
    email,
    isAdmin,
  });

  // const { email, password } = req.body;
  // const user = await User.findOne({
  //   email,
  // });
  // if (user && (await user.matchPassword(password))) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(401);
  //   throw new Error("Invalid email or password");
  // }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(401);
    throw new Error("User already exists");
  }
  const userSave = new User({ name, email, password });
  await userSave.save();

  const token = new Token({
    _userId: userSave._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  token.save(function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY
    );
    const msg = {
      from: process.env.EMAIL,
      to: userSave.email,
      subject: "Account Verification Link",
      text:
        "Hello " +
        userSave.name +
        ",\n\n" +
        "Please verify your account by clicking the link: \n" +
        process.env.URL +
        "confirmation/" +
        userSave.email +
        "/" +
        token.token +
        "\n\nThank You!\n",
    };

    //ES6

    //ES8f
    sgMail.send(msg).then(
      () => {
        return res.status(200).json({
          message:
            "A verification email has been sent to " +
            userSave.email +
            ". It will be expire after one day. If you did not get verification Email click on resend token.",
        });
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
        return res.status(500).json({
          msg:
            "Technical Issue!, Please click on resend for verify your Email.",
        });
      }
    );
  });

  // if (user) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status("400");
  //   throw new Error("invalid user data");
  // }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // let userByEmail = await User.findOne({email: req.body.email });
    // if (userByEmail) {
    //   res.status(401);
    //   throw new Error("User already exists");
    // }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    return res.status(200).json({ users });
  } else {
    res.status(400);
    throw new Error("Sorry there was an error Users not found");
  }
});
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(user){
 
   user.name = req.body.name||user.name;
    user.email = req.body.email||user.email;
   user.isAdmin = req.body.isAdmin;
   user.isVerified = req.body.isVerified;

  }
  else{
    throw new Error("User not found")
  }
 
  const userUpdate = await user.save();
  userUpdate.password="Authenticated"
  if (userUpdate) {
    res.status(200).json({userUpdate });
  } else {
    res.status(400);
    throw new Error("Update failed!!");
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.status(200).json({ message: "Deletion Successful"});
  } else {
    res.status(400);
    throw new Error("User deletion unsuccessful");
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  const orders= await Order.find({user:req.params.id});
  
 
  if (user) {

    res.json({ user,orders });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
})
export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  confirmEmail,
  resendLink,
  getUsers,
  updateUser,
  deleteUser,
  getUserById
};
