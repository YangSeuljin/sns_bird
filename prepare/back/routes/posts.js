const express = require('express');
const {Post, User, Image, Comment} = require('../models');
const {Op} = require('sequelize');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const where = {};
        //초기 로딩이 아닐 때
        if (parseInt(req.query.lastId, 10)) {
            where.id = {[Op.lt]: parseInt(req.query.lastId, 10)}
        }
        const posts = await Post.findAll({
            where,
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
                }],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }]
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
