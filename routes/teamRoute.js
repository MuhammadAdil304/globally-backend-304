const express = require('express');
const TeamController = require('../controller/teamController');
const router = express.Router();

router.post('/create', TeamController.createTeam);
router.get('/', TeamController.getAllTeamsWithMembers);
router.get('/:id/members', TeamController.getTeamMembers);

module.exports = router;