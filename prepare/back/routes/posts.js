const express = require('express');
const {Post, User, Image, Comment} = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    console.log('-------------------------------------get');
    try {
        const posts = await Post.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }]
        });
        console.log(posts);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;