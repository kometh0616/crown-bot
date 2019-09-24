module.exports = (sequelize, DataTypes) => {
    return sequelize.define('crowns', {
        guildID: {
            type: DataTypes.STRING,
            unique: `crown`
        },
        userID: {
            type: DataTypes.STRING,
            unique: `crown`
        },
        artistName: {
            type: DataTypes.STRING,
            unique: `crown`
        },
        artistPlays: DataTypes.INTEGER
    })
}