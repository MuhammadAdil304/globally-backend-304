// teamController.js
const Team = require('../models/teamModel');
const AuthModel = require('../models/authModel');
const { SendResponse } = require('../helpers/helpers');
const TeamController = {
  createTeam: async (req, res) => {
    try {
      const { name, members } = req.body;

      const newTeam = await Team.create({
        name,
        members: members || [],
      });

      if (members && members.length > 0) {
        const users = await AuthModel.find({ _id: { $in: members } });
        await Promise.all(users.map(async (user) => {
          // Update each member's team array
          await AuthModel.findByIdAndUpdate(user._id, { $push: { teams: newTeam._id } });
        }));
      }

      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        team: newTeam,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Team creation failed',
        error: error.message,
      });
    }
  },
  getTeamMembers: async (req, res) => {
    try {
      const  teamId  = req.params.id
      // const obj = teamId
      console.log(teamId)
      const team = await Team.findById(teamId);
      console.log(team)
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found',
        });
      }
      else {
        const memberDetails = await AuthModel.find({ _id: { $in: team.members } });
        res.status(200).json({
          success: true,
          members: memberDetails,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching team members',
        error: error.message,
      });
    }
  },
  getAllTeamsWithMembers: async (req, res) => {
    try {
      // Get all teams with members details
      const teams = await Team.find().populate({
        path: 'members',
        select: 'firstName lastName email  userStatus createdAt updatedAt',
        path:'tasks',
        select:'title description taskStatus'
      });

      res.status(200).json({
        success: true,
        message: 'All teams with members fetched successfully',
        teams,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching teams with members',
        error: error.message,
      });
    }
  }
};

module.exports = TeamController;
