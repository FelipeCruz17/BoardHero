module.exports = function (sequelize, DataTypes) {
  const Task_action = sequelize.define("Task_action", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Task_action.associate = (models) => {
    Task_action.belongsTo(models.Task, {
      foreignKey: "tasks_id",
      as: "actions",
    });

    Task_action.belongsTo(models.Task, {
      through: "task_has_actions",
      as: "tasks",
    });
  };

  return Task_action;
};
