// teamController.js
const Team = require('../models/teamModel');
const AuthModel = require('../models/authModel');
const { SendResponse } = require('../helpers/helpers');
const TeamController = {
   createTeam: async (req, res) => {
    try {
      // Assuming that the request body contains team name and an array of user IDs
      const { name, members } = req.body;

      // Create a new team
      const newTeam = await Team.create({
        name,
        members: members || [], // If members array is not provided, default to an empty array
      });

      // Add the team ID to each user's list of teams
      if (members && members.length > 0) {
        await AuthModel.updateMany(
          { _id: { $in: members } },
          { $push: { teams: newTeam._id } }
        );
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
  getTeams : async (req , res) => {
    try{
      console.log('ok')
      let { pageNo, pageSize } = req.query
      let skipPage = (pageNo - 1) * pageSize
      const result = await Team.find().limit(pageSize).skip(skipPage)
      res.send(SendResponse(true , 'All teams' , result))
    }
    catch(error){
      res.send(SendResponse(false , 'server error' , error))
    }
 
  }
};

module.exports = TeamController;
