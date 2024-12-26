const { User } = require('../schema/Video');

// const createUser = async (req, res) => {
//   try {
//     const { username, mailID, password } = req.body;

//     const userExists = await User.findOne({ $or: [{ mailID }, { username }] });
//     if (userExists) {
//       return res.status(400).json({ message: 'Email or Username already exists' });
//     }

//     const newUser = new User({
//       username,
//       mailID,
//       password,
//     });

//     await newUser.save();
//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         mailID: newUser.mailID,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error, please try again' });
//   }
// };

const createUser = async (req, res) => {
  let { role, username, mailID, password } = req.body;

  username = username.trim();

  if (!username || !mailID || !password || !role) {
    return res.status(400).json({
      status: "bad-request-error",
      message: "All fields (role, username, email, password) are required."
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { mailID }] });

    if (existingUser) {
      return res.status(400).json({
        status: "duplicate-entry",
        message: "Username or email already exists."
      });
    }

    const newUser = await User.create({ role, username, mailID, password });

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        mailID: newUser.mailID,
        role:newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error while creating user. Please try again."
    });
  }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); 
      res.status(200).json(users); 
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while fetching users'
      });
    }
  };
  
  const deleteUser = async (req, res) => {
    const { id } = req.params; 
  
    if (!id) {
      return res.status(400).json({
        status: "bad-request-error",
        message: "User ID is required."
      });
    }
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({
          status: "not-found",
          message: "User not found."
        });
      }
  
      return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Server error while deleting user."
      });
    }
  };

  const getUserByUsername = async (req, res) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username query parameter is required' });
    }
  
    try {
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        id: user._id,
        username: user.username,
        mailID: user.mailID,
        password: user.password,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  
  module.exports = { createUser, getAllUsers, deleteUser, getUserByUsername };
