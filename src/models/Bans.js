module.exports = (sequelize, DataTypes) => {
    return sequelize.define('bans', {
        guildID: {
            type: DataTypes.STRING,
            unique: `ban`
        },
        userID: {
            type: DataTypes.STRING,
            unique: `ban`
        }
    })
}