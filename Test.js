const Operate = require('./DAO');
let operate = new Operate();

const user = { name: '瑾瑜', password: '123', id: 2 };
// operate.setUser(user);

// let userList = operate.getUser();
// console.log(userList);

console.log(operate.checkUser(user));
