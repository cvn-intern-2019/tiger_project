var mongoose = require("mongoose");
var Grid = require("gridfs-stream");
var GridFsStorage = require("multer-gridfs-storage");

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.Promise = global.Promise;
const connStr = "mongodb://tiger:tiger123@localhost:27017/werewolf";

module.exports.init = () => {
  mongoose.connect(connStr, err => {
    if (err) fail(err);
    else console.log("Connected database!");
    Grid.mongo = mongoose.mongo;
    let gfs = new Grid(mongoose.connection.db);
    gfs.collection("avatars");

    global.gfs = gfs;
  });
};

global.storage = new GridFsStorage({
  url: connStr,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = req.session.username;
      const fileInfo = {
        filename: filename,
        bucketName: "avatars"
      };
      resolve(fileInfo);
    });
  }
});
