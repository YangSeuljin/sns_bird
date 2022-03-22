module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('User', {
        //id가 기본적으로 들어있다.
        content: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글 저장
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
    };

    return Hashtag;
}
