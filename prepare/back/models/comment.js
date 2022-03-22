module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('User', {
        //id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // UserId: 1
        // PostId: 3
    }, {
        charset:'utf8',
        collate:'utf8_general_ci', //한글 저장
    });
    Comment.associate = (db) =>{
        db.Comment.belongsTo(db.User)
    };

    return Comment;
}
