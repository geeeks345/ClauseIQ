const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminMetrics,
  getAllContractsAdmin,
} = require('../../controllers/adminController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// All admin routes require authentication and 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/metrics', getAdminMetrics);
router.get('/contracts', getAllContractsAdmin);

module.exports = router;
