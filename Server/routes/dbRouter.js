const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { addData, getData, searchData, createIndex, updateData, removeData } = require("../config/userDBconfig");
const { createUser, dropUser, dropDatabase } = require("../modules/manageDB");
const { encrypt, decrypt } = require("../modules/encryptDecrypt");
const { verifyToken } = require("../config/verifyToken");

const userDB = process.env.DB_USER_DB;
const userDBUser = process.env.DB_USER_USER;
const userDBPass = process.env.DB_USER_PASS;

/*************************** For Web Interface *****************************/

const db = { user: userDBUser, pass: userDBPass, database: userDB };

router.post("/", verifyToken, async (req, res) => {
  //Check for reserved Database name
  if (
    req.body.db.toString() == "admin" ||
    req.body.db.toString() == "config" ||
    req.body.db.toString() == "local" ||
    req.body.db.toString() == "test" ||
    req.body.db.toString() == userDB
  ) {
    return res.json({ error: "Invalid Database Name!" });
  }

  if (
    req.body.db.toString().toLowerCase() == "admin" ||
    req.body.db.toString().toLowerCase() == "config" ||
    req.body.db.toString().toLowerCase() == "local" ||
    req.body.db.toString().toLowerCase() == "test" ||
    req.body.db.toString().toLowerCase() == userDB
  ) {
    return res.json({ error: "Invalid Database Name!" });
  }

  //Check if Database already Exists:
  const search = await searchData(db, "dataBaseRecord", { db: req.body.db.toString().toLowerCase() });
  if (search.length > 0) return res.json({ error: "Database already exists!" });

  //Generate Token and Encrypt Token and Password
  const data = { user: req.body.user.toString(), db: req.body.db.toString().toLowerCase(), name: req.body.name.toString() };
  let userToken = jwt.sign({ id: data.user, db: data.db, date: Date.now() }, process.env.ENCRYPTION_SECRET);
  userToken = await encrypt(userToken);
  let pass = await encrypt(req.body.pass.toString());
  data.pass = pass;
  data.userToken = userToken;
  data.viewed = "false";
  data.createdBy = req.user.id;
  data.memoryLimit = "none";

  //Add record to User Database, create new DB and assign user role.
  await addData(db, "dataBaseRecord", data);
  await createUser({ db: data.db, user: data.user, pass: req.body.pass.toString() });
  return res.json({ message: "Database Created" });
});

router.post("/updateDBUser", verifyToken, async (req, res) => {
  const database = await searchData(db, "dataBaseRecord", { _id: req.body.dbID });
  const data = { user: req.body.dbUser.toString(), pass: await encrypt(req.body.dbPass.toString()) };
  let userToken = jwt.sign({ id: data.user, db: database[0].db, date: Date.now() }, process.env.ENCRYPTION_SECRET);
  userToken = await encrypt(userToken);
  data.userToken = userToken;
  data.viewed = "false";

  await updateData(db, "dataBaseRecord", req.body.dbID, data);
  await dropUser({ db: database[0].db, user: database[0].user });
  await createUser({ db: database[0].db, user: data.user, pass: req.body.dbPass.toString() });
  return res.json({ message: "User Updated!" });
});

router.post("/generateNewAPIKey", verifyToken, async (req, res) => {
  const database = await searchData(db, "dataBaseRecord", { _id: req.body.id });
  let userToken = jwt.sign({ id: database[0].user, db: database[0].db, date: Date.now() }, process.env.ENCRYPTION_SECRET);
  userToken = await encrypt(userToken);
  data = { userToken, viewed: "false" };
  await updateData(db, "dataBaseRecord", req.body.id, data);
  return res.json({ message: "➡️ New API Key Generated!" });
});

router.post("/deleteProject", verifyToken, async (req, res) => {
  const database = await searchData(db, "dataBaseRecord", { _id: req.body.id });
  await dropDatabase({ db: database[0].db, user: database[0].user });
  await removeData(db, "dataBaseRecord", req.body.id);
  return res.json({ message: "Project Deleted!" });
});

/*************************** For Client Side API Request ***************************/

async function verifyClientToken(token) {
  try {
    const dbInfo = jwt.verify(token, process.env.ENCRYPTION_SECRET);
    return dbInfo;
  } catch {
    return null;
  }
}

router.post("/getDataAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await getData(data, req.body.collection);
  return res.json(response);
});

router.post("/createIndexAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  if (!req.body.data) return res.json({ error: "No data to create Index!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await createIndex(data, req.body.collection, req.body.data);
  return res.json(response);
});

router.post("/addDataAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  if (!req.body.data) return res.json({ error: "No data to add!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await addData(data, req.body.collection, req.body.data);
  return res.json(response);
});

router.post("/searchDataAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  if (!req.body.data) return res.json({ error: "Empty search query!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await searchData(data, req.body.collection, req.body.data);
  return res.json(response);
});

router.post("/updateDataAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  if (!req.body.data) return res.json({ error: "Nothing to update!" });
  if (!req.body.id) return res.json({ error: "No ID Provided!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await updateData(data, req.body.collection, req.body.id, req.body.data);
  return res.json(response);
});

router.post("/removeDataAPI", async (req, res) => {
  if (!req.body.token) return res.json({ error: "No token found!" });
  if (!req.body.collection) return res.json({ error: "No Collection found!" });
  if (!req.body.id) return res.json({ error: "No ID Provided!" });
  token = await verifyClientToken(await decrypt(req.body.token));
  if (!token) return res.json({ error: "Invalid Token!" });
  const database = (await searchData(db, "dataBaseRecord", { db: token.db }))[0];
  if (!database) return res.json({ error: "You are doing something suspicious!" });
  if (database.userToken !== req.body.token) return res.json({ error: "Invalid Token!" });
  const data = { database: database.db, user: database.user, pass: await decrypt(database.pass) };
  const response = await removeData(data, req.body.collection, req.body.id);
  return res.json(response);
});

module.exports = router;
