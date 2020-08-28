const axios = require("axios");

const getDataAPIUrl = "https://db.mrsajjal.com/database/getDataAPI";
const addDataAPIUrl = "https://db.mrsajjal.com/database/addDataAPI";
const searchDataAPIUrl = "https://db.mrsajjal.com/database/searchDataAPI";
const updateDataAPIUrl = "https://db.mrsajjal.com/database/updateDataAPI";
const removeDataAPIUrl = "https://db.mrsajjal.com/database/removeDataAPI";
const createIndexAPIUrl = "https://db.mrsajjal.com/database/createIndexAPI";

async function getData(data) {
  try {
    const response = await axios.post(getDataAPIUrl, data);
    return response.data;
  } catch {
    return { error: "Server is not responding!" };
  }
}

async function addData(data) {
  try {
    const response = await axios.post(addDataAPIUrl, data);
    return response.data;
  } catch {
    console.log({ error: "Server is not responding!" });
    return { error: "Server is not responding!" };
  }
}

async function searchData(data) {
  try {
    const response = await axios.post(searchDataAPIUrl, data);
    return response.data;
  } catch {
    return { error: "Server is not responding!" };
  }
}

async function updateData(data) {
  try {
    const response = await axios.post(updateDataAPIUrl, data);
    return response.data;
  } catch {
    return { error: "Server is not responding!" };
  }
}

async function removeData(data) {
  try {
    const response = await axios.post(removeDataAPIUrl, data);
    return response.data;
  } catch {
    return { error: "Server is not responding!" };
  }
}

async function createIndex(data) {
  try {
    const response = await axios.post(createIndexAPIUrl, data);
    return response.data;
  } catch {
    return { error: "Server is not responding!" };
  }
}

module.exports = { getData, addData, searchData, updateData, removeData, createIndex };
