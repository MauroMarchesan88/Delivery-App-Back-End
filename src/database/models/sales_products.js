const SalesProducts = (sequelize, DataTypes) => {
  const SalesProducts = sequelize.define("SalesProducts", {
    saleId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: { model: 'sales', key: 'id'},
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: { model: 'products', key: 'id'}
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'sales_products',
    timestamps: false,
    underscored: true,
  })

  SalesProducts.associate = (models) => {
    models.Sale.belongsToMany(models.Product,
      { foreignKey: 'saleId', as: 'products', through: SalesProducts, otherKey: 'productId' });
    models.Product.belongsToMany(models.Sale,
      { foreignKey: 'productId', as: 'sale', through: SalesProducts, otherKey: 'saleId' });
  };

  return SalesProducts;
};

module.exports = SalesProducts;