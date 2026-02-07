const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// GET /api/members - Get all members
router.get('/', memberController.getAllMembers);

// GET /api/members/:id - Get member by ID
router.get('/:id', memberController.getMemberById);

// POST /api/members - Add new member
router.post('/', memberController.addMember);

// PUT /api/members/:id - Update member
router.put('/:id', memberController.updateMember);

// DELETE /api/members/:id - Delete member
router.delete('/:id', memberController.deleteMember);

module.exports = router;
