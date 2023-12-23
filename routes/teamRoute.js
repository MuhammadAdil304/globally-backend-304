const express = require('express');
const TeamController = require('../controller/teamController');
const router = express.Router();

router.post('/create', TeamController.createTeam);
router.get('/', TeamController.getAllTeamsWithMembers);
router.get('/:id/members', TeamController.getTeamMembers);
// router.post('/join', (req, res) => {
//     const { teamId } = req.body;
//     const io = req.app.get('io'); // Retrieve io from the app
//     const socket = req.app.get('socket'); // Retrieve socket from the app
//     TeamController.joinTeam(io, socket, teamId);
//     res.status(200).json({ success: true, message: 'User joined team room' });
//   });
router.post('/sendMessage', async (req, res) => {
    const { teamId, senderId , content } = req.body;
    TeamController.sendMessage(req.app.io, { teamId, content , senderId });
    res.status(200).json({ success: true, message: 'Message sent' , senderId});
});
// router.get('/disconnect', (req, res) => {
//     TeamController.disconnectUser();
//     res.status(200).json({ success: true, message: 'User disconnected' });
// });


module.exports = router;