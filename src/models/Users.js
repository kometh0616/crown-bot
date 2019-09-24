module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        userID: {
            type: DataTypes.STRING,
            unique: true
        },
        username: DataTypes.STRING
    })
}