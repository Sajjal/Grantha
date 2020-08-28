const express = require("express");
const router = express.Router();

const { verifyToken } = require("../config/verifyToken");
const { searchData, updateData } = require("../config/dbConfig");
const { getCollections, getDBStats, getCollectionID, getCollectionData, deleteCollectionData } = require("../modules/manageDB");

router.post("/", verifyToken, async (req, res) => {
  const username = await searchData("users", { _id: req.user.id });
  const databases = await searchData("dataBaseRecord", { createdBy: req.user.id });

  const projects = databases.map((project) => {
    return { name: project.name, _id: project._id };
  });

  return res.json({ message: `${username[0].username}'s Dashboard !`, projects });
});

router.post("/viewAPIKey", verifyToken, async (req, res) => {
  const project = await searchData("dataBaseRecord", { _id: req.body.id });
  if (project[0].viewed == "false") {
    await updateData("dataBaseRecord", req.body.id, { viewed: "true" });
    apiKey = project[0].userToken;
    return res.json({ message: apiKey });
  } else
    return res.json({
      error:
        "➡️ You have already viewed the API key once. <br>➡️ You are welcome to generate a new Key! <br> ➡️ Keep in mind, it will invalidate the old one!",
    });
});

router.post("/explore", verifyToken, async (req, res) => {
  const project = await searchData("dataBaseRecord", { _id: req.body.id });
  let stat = [await getDBStats({ db: project[0].db })];
  stat = JSON.stringify(JSON.parse(stat), null, 4);
  let collections = await getCollections({ db: project[0].db });
  return res.json({ message: stat, collections });
});

router.post("/getCollectionID", verifyToken, async (req, res) => {
  const database = (await searchData("dataBaseRecord", { _id: req.body.id }))[0].db;
  let data = await getCollectionID({ db: database, collection: req.body.collection });
  return res.json({ message: data });
});

router.post("/getCollectionData", verifyToken, async (req, res) => {
  const database = (await searchData("dataBaseRecord", { _id: req.body.db }))[0].db;
  let data = await getCollectionData({ db: database, collection: req.body.collection, id: req.body.id });
  return res.json({ message: data });
});

router.post("/deleteCollectionData", verifyToken, async (req, res) => {
  const database = (await searchData("dataBaseRecord", { _id: req.body.db }))[0].db;
  await deleteCollectionData({ db: database, collection: req.body.collection, id: req.body.id });
  return res.json({ message: "Record Removed!" });
});

module.exports = router;
