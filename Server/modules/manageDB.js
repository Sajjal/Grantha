const { linuxCommand } = require("./linuxCommand");

const dbAdminUser = process.env.DB_ADMIN_USER;
const dbAdminPass = process.env.DB_ADMIN_PASS;

async function createUser(data) {
  await linuxCommand(
    ` echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.createUser({user: "${data.user}", pwd: "${data.pass}", roles: [ { role: "readWrite", db: "${data.db}" } ] })
EOF
      )`
  );
  return;
}

async function dropUser(data) {
  await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.dropUser("${data.user}")
EOF
      )`
  );
  return;
}

async function dropDatabase(data) {
  await dropUser(data);
  await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.dropDatabase()
EOF
      )`
  );
  return;
}

async function getCollections(data) {
  let collections = await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      show collections
EOF
    )`
  );
  collections = collections.split(`switched to db ${data.db}`)[1].split("bye")[0].trim().split(" ");
  return collections;
}

async function getDBStats(data) {
  let stats = await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.stats(1024*1024)
EOF
    )`
  );
  stats = stats.split(`switched to db ${data.db}`)[1].split("bye")[0].trim();
  return stats;
}

async function getCollectionID(data) {
  let ids = await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.${data.collection}.find({}, {_id:1}).map(function(item){ return item._id; })
EOF
    )`
  );
  ids = ids.split(`switched to db ${data.db}`)[1].split("bye")[0].trim();
  ids = ids
    .slice(1, ids.length - 1)
    .trim()
    .split(",");

  const objectIDs = [];
  ids.forEach((element) => {
    objectIDs.push(element.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""));
  });
  return objectIDs;
}

async function getCollectionData(data) {
  let collectionData = await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.${data.collection}.find({"_id" : ObjectId("${data.id}")},{'_id': false})
EOF
    )`
  );
  collectionData = collectionData.split(`switched to db ${data.db}`)[1].split("bye")[0].trim().replace("} {", "}, {");
  return collectionData;
}

async function deleteCollectionData(data) {
  let removeData = await linuxCommand(
    `echo $( mongo -u ${dbAdminUser} -p ${dbAdminPass} --authenticationDatabase admin <<EOF
      use ${data.db}
      db.${data.collection}.remove({_id:ObjectId("${data.id}")});
EOF
    )`
  );
  removeData = removeData.split(`switched to db ${data.db}`)[1].split("bye")[0].trim().replace("} {", "}, {");
  return;
}

module.exports = {
  createUser,
  dropUser,
  dropDatabase,
  getCollections,
  getDBStats,
  getCollectionData,
  getCollectionID,
  deleteCollectionData,
};
