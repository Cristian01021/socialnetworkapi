const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
      res.json(thoughts)
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');
      if (!thought) {
        return res.status(4040).json({ message: 'no thought with that ID' })
      }
      res.json(thought)
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        { $push: { thoughts: thought._id } },
        { new: true }
      )
      res.json({ message: 'thought has been created', thought });
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'no thought with that ID' });
      }
      res.json({ message: 'thought has been Updated', thought })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId
      });
      if (!thought) {
        return res.status(404).json({ message: 'no thought with that ID' });
      }
      res.json({ message: 'thought successfully deleted' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    console.log('you are adding a reaction');
    console.log(req.body);
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'no thought with that ID' })
      }
      res.json({message: `your reaction has been added!`, thought});
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      console.log('you are removing a reaction')
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'no thought with that ID' })
      }
      res.json({ message: `your reaction has been Removed!`, thought });
    } catch (err) {
      res.status(500).json(err)
    }
  },
};