const fs = require('fs');

function operate() {
  const user_path = './db/users.json';
  const session_path = './db/session.json';
  let DataBaseString;
  let DataBaseArray;
  this.setUser = function(user) {
    DataBaseString = fs.readFileSync(user_path);
    DataBaseArray = JSON.parse(DataBaseString);
    DataBaseArray.push(user);
    DataBaseString = JSON.stringify(DataBaseArray);
    fs.writeFileSync(user_path, DataBaseString);
  };
  this.getUsers = function() {
    DataBaseString = fs.readFileSync(user_path);
    DataBaseArray = JSON.parse(DataBaseString);
    return DataBaseArray;
  };
  this.checkUser = function(user) {
    DataBaseString = fs.readFileSync(user_path);
    DataBaseArray = JSON.parse(DataBaseString);
    const Data = DataBaseArray.find(item => {
      return item.name === user.name && item.password === user.password;
    });
    return Data;
  };
  this.searchUser = function(id) {
    const user_id = id - 0;
    DataBaseString = fs.readFileSync(user_path);
    DataBaseArray = JSON.parse(DataBaseString);
    const Data = DataBaseArray.find(item => {
      return item.id === user_id;
    });
    return Data;
  };
  this.getIndex = function(user) {
    let index;
    DataBaseString = fs.readFileSync(user_path);
    DataBaseArray = JSON.parse(DataBaseString);
    if (DataBaseArray.length !== 0) {
      index = DataBaseArray[DataBaseArray.length - 1].id;
    } else {
      index = 0;
    }
    return index;
  };
  this.setSession = function(user_id) {
    DataBaseString = fs.readFileSync(session_path);
    DataBaseObj = JSON.parse(DataBaseString);
    const number = Math.random();
    DataBaseObj[number] = { user_id: user_id };
    DataBaseString = JSON.stringify(DataBaseObj);
    fs.writeFileSync(session_path, DataBaseString);
    return number;
  };
  this.searchSession = function(session_id) {
    let Data = {};
    DataBaseString = fs.readFileSync(session_path);
    DataBaseObj = JSON.parse(DataBaseString);
    if (DataBaseObj[session_id]) {
      Data = DataBaseObj[session_id];
    }
    return Data;
  };
}
module.exports = operate;
