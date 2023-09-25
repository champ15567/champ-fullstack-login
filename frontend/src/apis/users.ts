export const apiUsers = {
  login: {
    method: "post",
    url: "http://localhost:4000/login",
  },
  createUsers: {
    method: "post",
    url: "http://localhost:4000/users",
  },
  getAllUsers: {
    method: "get",
    url: "http://localhost:4000/users",
  },
  getOneUsers: {
    method: "get",
    url: "http://localhost:4000/users/",
  },
  editUsers: {
    method: "put",
    url: "http://localhost:4000/users/",
  },
  deleteUsers: {
    method: "delete",
    url: "http://localhost:4000/users/",
  },
};
