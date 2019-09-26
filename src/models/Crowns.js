module.exports = (sequelize, DataTypes) => {
    return sequelize.define('crowns', {
        guildID: {
            type: DataTypes.STRING,
            unique: `crown`
        },
        userID: DataTypes.STRING,
        artistName: {
            type: DataTypes.STRING,
            unique: `crown`
        },
        artistPlays: DataTypes.INTEGER
    })
}