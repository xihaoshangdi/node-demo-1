const fs = require('fs');

function operate() {
  const path = './db/users.json';
  let DataBaseString;
  let DataBaseArray;
  this.setUser = function(user) {
    DataBaseString = fs.readFileSync(path);
    DataBaseArray = JSON.parse(DataBaseString);
    DataBaseArray.push(user);
    DataBaseString = JSON.stringify(DataBaseArray);
    fs.writeFileSync(path, DataBaseString);
  };
  this.getUsers = function() {
    DataBaseString = fs.readFileSync(path);
    DataBaseArray = JSON.parse(DataBaseString);
    return DataBaseArray;
  };
  this.checkUser = function(user) {
    DataBaseString = fs.readFileSync(path);
    DataBaseArray = JSON.parse(DataBaseString);
    const Data = DataBaseArray.find(item => {
      return item.name === user.name && item.password === user.password;
    });
    return Data;
  };
  this.getIndex = function(user) {
    let index;
    DataBaseString = fs.readFileSync(path);
    DataBaseArray = JSON.parse(DataBaseString);
    if (DataBaseArray.length !== 0) {
      index = DataBaseArray[DataBaseArray.length - 1].id;
    } else {
      index = 0;
    }
    return index;
  };
}
module.exports = operate;
