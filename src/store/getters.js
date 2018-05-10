const getters = {
  roles: state => state.user.roles,
  sidebar: state => state.app.sidebar,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  mark: state => state.permission.mark,
  bodyWidth: state => state.app.bodyWidth,
  email: state => state.user.email,
  table: state => state.user.table,
  table1: state => state.user.table1,
  table2: state => state.user.table2,
  table3: state => state.user.table3,
  name: state => state.user.name,
  permission: state => state.user.permission,
  productNames: state => state.user.productName,
  currentProduct: state => state.permission.currentProduct
}
export default getters
