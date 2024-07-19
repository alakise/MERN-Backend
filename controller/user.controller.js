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

/**
 * Changes the role of a user based on the provided user ID and new role.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} JSON response indicating the status of the role change operation.
 */
exports.changeUserRole = async (req, res) => {
    try {
      const { userId, newRole } = req.body;
  
      if (!userId || !newRole) {
        return res.status(400).json({ message: "User ID and new role are required" });
      }
  
      const userToUpdate = await User.findById(userId);
  
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the authenticated user has permission to change roles
      if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({ message: "You don't have permission to change user roles" });
      }
  
      // Check if a moderator is trying to change to/from admin status
      if (req.user.role === 'moderator' && (newRole === 'admin' || userToUpdate.role === 'admin')) {
        return res.status(403).json({ message: "Moderators can't edit admin status" });
      }
  
      // Ensure the new role is valid
      const validRoles = ['basic', 'moderator', 'admin'];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
  
      userToUpdate.role = newRole;
      await userToUpdate.save();
  
      res.status(200).json({
        status: 'success',
        message: 'User role updated successfully',
        data: {
          user: {
            id: userToUpdate._id,
            role: userToUpdate.role
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };