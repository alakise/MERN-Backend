const User = require('../model/User.model');

exports.updateUser = async (req, res) => {
  try {
    // Only allow updating certain fields
    const allowedUpdates = ['firstname', 'lastname', 'email'];
    const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
    
    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid update fields provided" });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the authenticated user is an admin or the user themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "You don't have permission to delete this user" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};