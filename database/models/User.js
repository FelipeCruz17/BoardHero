module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Task, {
      through: "user_has_tasks",
      as: "tasks",
    });
    User.belongsToMany(models.Workspace, {
      through: "users_has_workspaces",
      as: "workspaces",
    });
    User.hasOne(models.Character, {
      as: 'character'
    });
  };

  return User;
};
