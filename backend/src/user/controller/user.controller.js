// Please don't change the pre-written code
// Import the necessary modules here

import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken } from "../../../utils/sendToken.js";
import {
  createNewUserRepo,
  deleteUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
  getAllUsersRepo,
  updateUserProfileRepo,
  updateUserRoleAndProfileRepo,
} from "../models/user.repository.js";
import crypto from "crypto";

export const createNewUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await findUserRepo({ email }, true);

    // if user already exist then return appropriate response
    if (user) {
      return next(new ErrorHandler(400, "Email is Already Registered"));
    }

    // create new user
    const newUser = await createNewUserRepo(req.body);

    // send jsonwebtoken
    await sendToken(newUser, res, 200);

    // Implement sendWelcomeEmail function to send welcome message
    await sendWelcomeEmail(newUser);
  } catch (err) {
    //  handle error for duplicate email
    return next(new ErrorHandler(400, err));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "please enter email/password"));
    }
    const user = await findUserRepo({ email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Invalid email or passswor!"));
    }
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const logoutUser = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, msg: "logout successful" });
};

export const forgetPassword = async (req, res, next) => {
  // get the required data from the req.body object
  const { email } = req.body;

  try {
    // find the user by email
    const user = await findUserRepo({ email }, true);
    if (!user) {
      // user not found
      return next(new ErrorHandler(404, "User not found! Enter valid Email."));
    }

    // get password reset token
    const resetToken = await user.getResetPasswordToken();

    // send password reset email
    await sendPasswordResetEmail(user, resetToken);

    // save the updated user
    await user.save();

    // send proper response
    res.status(200).json({
      success: true,
      msg: "Password reset link sent to your email'",
      resetToken: user.resetPasswordToken,
    });
  } catch (error) {
    return next(new ErrorHandler(404, error));
  }
};

export const resetUserPassword = async (req, res, next) => {
  // get the data from req body
  const { password, confirmPassword } = req.body;
  const resetToken = req.params.token;

  try {
    // find the user by the reset token
    const user = await findUserForPasswordResetRepo(resetToken);
    if (!user) {
      // if user not found
      return next(new ErrorHandler(404, "User not found!"));
    }

    // check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return next(new ErrorHandler(400, "Does not Match ConfirmPassword"));
    }

    // update old password with new password
    user.password = password;

    // clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // save the user
    await user.save();

    // send response to client
    res
      .status(200)
      .send({ message: "Password reset successfully", success: true });
  } catch (error) {
    return next(new ErrorHandler(500, "Internal Server Error!"));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.user._id });
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!currentPassword) {
      return next(new ErrorHandler(401, "pls enter current password"));
    }

    const user = await findUserRepo({ _id: req.user._id }, true);
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Incorrect current password!"));
    }

    if (!newPassword || newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(401, "mismatch new password and confirm password!")
      );
    }

    user.password = newPassword;
    await user.save();
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUserDetails = await updateUserProfileRepo(req.user._id, {
      name,
      email,
    });
    res.status(201).json({ success: true, updatedUserDetails });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// admin controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsersRepo();
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getUserDetailsForAdmin = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.params.id });
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserRepo(req.params.id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }

    res
      .status(200)
      .json({ success: true, msg: "user deleted successfully", deletedUser });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfileAndRole = async (req, res, next) => {
  // Write your code here for updating the roles of other users by admin
  // Get the data/info from the req.body object
  const { name, email, role } = req.body;

  try {
    // find the user by id
    const userToUpdate = await findUserRepo({ _id: req.params.id });
    if (!userToUpdate) {
      // user not found
      return next(new ErrorHandler(404, "User Not Found!"));
    }

    // check if the role is not admin
    if (!role || role !== "admin") {
      return next(
        new ErrorHandler(
          403,
          "Unauthorized! Only admins can update user profiles and roles."
        )
      );
    }

    // update the userprofile
    if (name) {
      userToUpdate.name = name;
    }

    if (email) {
      userToUpdate.email = email;
    }

    if (role) {
      userToUpdate.role = role;
    }
    // save the updated user
    await updateUserProfileRepo(req.params.id, userToUpdate);

    // Send a response to client
    res.status(200).send({ message: "User Profile and Role Updated Successfully!" });
  } catch (error) {
    console.error('Error in updateUserProfileAndRole:', error);
    return next(new ErrorHandler(500, "Server Error! Try again after some time."))
  }
};
