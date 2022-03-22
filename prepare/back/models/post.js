module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('User', {
        //id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글 저장
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, {as: 'Retweet'});
        db.Post.belongsToMany(db.Hashtag,{through:'hashtag',as:'hash'});
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers'});
    };

    return Post;
};
