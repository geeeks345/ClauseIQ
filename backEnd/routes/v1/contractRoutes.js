const express = require('express');
const router = express.Router();
const {
  uploadContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  downloadRawFile
} = require('../../controllers/contractController');
const { protect } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

router.use(protect);

router.post('/upload', upload.single('file'), uploadContract);
router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);
router.get('/:id/download', downloadRawFile);

module.exports = router;
