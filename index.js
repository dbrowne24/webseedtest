/**
 * Try to see if we can create a web seed server...
 * Fuck me this is not easy...
 */

const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const express = require("express");
const expressAPI = express(); 
const fs = require("fs");

const multer = require("multer");
const createTorrent = require("create-torrent");
const parseTorrent = require("parse-torrent");

expressAPI.use(bodyParser.urlencoded({extended:true}));
expressAPI.use(bodyParser.json());
expressAPI.use(cors());

// TODO -> Trying to set up static files
expressAPI.use("/torrent_data", express.static("./torrent_data"));
expressAPI.use("/torrent_files", express.static("./torrent_files"));


// Set up multer to handle file storage...
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.DEFAULT_DOWNLOAD_PATH);
  },
  filename: function(req, file, cb) {
    // Append the current date and time to the file name as a torrent node 
    // cannot seed 2 torrents with the same info hash.
    cb(null, file.originalname + "-" + Date.now());
  }
});

const multerUpload = multer({storage: storage});


expressAPI.get("/", (req, res) => {
  console.log("[+] GET request detected at: '/'");
  res.send("Hey you've found an ethertorrent node!");
});

expressAPI.post("/torrents", multerUpload.any(), function(req, res) {
  if(!req.files) {
    return res.status(400).send({
      message: "You must post a file"
    });
  }

  let filePaths = [];
  req.files.forEach((file) => {
    filePaths.push(file.path);
  });

  const url = "http://localhost:5000/";
  const webSeedUrl = url + "torrent_data";

  createTorrent(filePaths, 
    {urlList: webSeedUrl}, 
    (err, torrent) => {
    if(err) return console.log("error: " + err);
    
    const parsedTorrent = parseTorrent(torrent);

    console.log("[+] Torrent name: " + parsedTorrent.name);
    const torrentFileLocation = "torrent_files/" + parsedTorrent.name + ".torrent";


    console.log("\n\n");
    console.log("[+] Web seed url: " + webSeedUrl);
    console.log("[+] Torrent File Location: " + url + torrentFileLocation);
    console.log("\n\n");

    fs.writeFileSync(torrentFileLocation, torrent);

    const magnetURI = parseTorrent.toMagnetURI({
      infoHash: parsedTorrent.infoHash,
      name: parsedTorrent.name,
      files: parsedTorrent,
      urlList: parsedTorrent.urlList,
      announce: parsedTorrent.announce,
      xs: url + torrentFileLocation
    });

    console.log(magnetURI);
    res.send(magnetURI);
  });
});


expressAPI.listen(7500, () => {
  console.log("[+] webseed listening on port: 5000");
});