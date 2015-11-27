var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/avatarUpload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log("Upload Avatar : " + filename);
        fstream = fs.createWriteStream(__dirname + '/public/avatar/' + filename);
        file.pipe(fstream);
        fstream.on('close', function() {
            res.redirect('back');
        });
    });
});

module.exports = router;
