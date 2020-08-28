//Add data to the Collection
async function addData(db, collectionName, data) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    const response = await collection.insert(data);
    return response;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

//Get data from Collection
async function getData(db, collectionName) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    let data = await collection.find();
    return data;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

//Search on Collection
async function searchData(db, collectionName, data) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    let result = await collection.find(data);
    return result;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

//Create an Index of Collection
async function createIndex(db, collectionName, data) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    let result = await collection.createIndex(data);
    return result;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

//Update a record in Collection
async function updateData(db, collectionName, id, data) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    const response = await collection.update({ _id: id }, { $set: data });
    return response;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

//Remove a record from Collection
async function removeData(db, collectionName, id) {
  try {
    db = require("monk")(`${db.user}:${db.pass}@localhost/${db.database}`);
    const collection = db.get(collectionName);
    const response = await collection.remove({ _id: id });
    return response;
  } catch (error) {
    return { error: "Something went wrong! Double check your input!" };
  }
}

module.exports = { addData, getData, searchData, createIndex, updateData, removeData };
