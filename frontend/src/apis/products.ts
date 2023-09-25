export const apiProducts = {
  createProducts: {
    method: "post",
    url: "http://localhost:4000/products",
  },
  getAllProducts: {
    method: "get",
    url: "http://localhost:4000/products",
  },
  getOneProducts: {
    method: "get",
    url: "http://localhost:4000/products/",
  },
  editProducts: {
    method: "put",
    url: "http://localhost:4000/products/",
  },
  deleteProducts: {
    method: "delete",
    url: "http://localhost:4000/products/",
  },
};
