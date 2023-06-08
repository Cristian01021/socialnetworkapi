const {User, Thought} = require('../models');

module.exports = {
  async getUsers(req,res){
    try{
      const users = await User.find();
      res.json(users);
    }catch(err){
      console.log('error$$$$$$$')
      res.status(500).json(err);
    }
  },
  // get single user
  async getSingleUser(req,res){
    try{
      const user = await User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('thoughts')
        .populate('friends');
         //exclude the -__v field

      if (!user){
        return res.status(404).json({message: 'no user with that ID'});
      }
    
      res.json(user);
    }catch(err){
      console.log(err);
      res.status(500).json(err);
    }
  },
  async createUser(req,res){
    try{
      const user = await User.create(req.body);
      console.log('created user')
      res.json(user);
    }catch(err){
      console.log(err)
      return res.status(500).json(err);
    }
  },
  async deleteUser(req,res){
    try{
      const user = await User.findOneAndDelete({
        _id: req.params.userId
      });
      if (!user){
        res.status(404).json({message: 'no user with that ID'});
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts }});
      res.json({message: `user and thoughts DELETED for ${user.username}`});
    }catch(err){
      res.status(500).json(err);
    }
  },
  async updateUser(req,res){
    try{
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user){
        res.status(404).json({message: 'no user with that ID'});
      }
      res.json({message: `${user.username} updated`, user});
    }catch(err){
      res.status(500).json(err);
    }
  },
  async addFriend(req,res){
    console.log('you are adding a friend');
    try{
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.userId }},
        { runValidators: true, new: true}
      );
      if (!user){
        return res.status(404).json({message: 'no friend with that ID'});
      }
      res.json({ message: `${user.username} added as Friend`, user});
    }catch(err){
      res.status(500).json(err);
    }
  },
  async removeFriend(req,res){
    try{
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {$pull: { friends: { userId: req.params.userId}}},
        { runValidators: true, new: true }
      );
      if (!friend){
        return res.status(404).json({message: 'no friend with that ID'});
      }
      res.json({ message: `${friend.username} is not your friend anymore`, friend });
    }catch(err){
      res.status(500).json(err);
    }
  }
};