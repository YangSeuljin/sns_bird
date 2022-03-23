const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const {User, Post} = require("../models");
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();


router.get('/', async (req, res, next) => { // GET /user
    console.log('req.user = ' + req.user);
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            next(err);
        }
        if (info) {
            return res.status(403).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            try {
                const fullUserWithoutPassword = await User.findOne({
                    where: {id: user.id},
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [{
                        model: Post,
                    }, {
                        model: User,
                        as: 'Followings',
                    }, {
                        model: User,
                        as: 'Followers'
                    }]
                })
                return res.status(200).json(fullUserWithoutPassword);
            } catch (error) {
                console.error(error);
            }

        });
    })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
        res.json();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});

module.exports = router;