const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes.js');
const friendRoutes = require('./friendRoutes.js');
const reactionRoutes = require('./reactionRoutes.js');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);
router.use('/friends', friendRoutes);
router.use('/reactions', reactionRoutes);


module.exports = router;