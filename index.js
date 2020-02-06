#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const userArgs = process.argv.slice(2);
const folder = userArgs[0];

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let fileName = list[i++];
            if (!fileName) return done(null, results);
            let file = path.resolve(dir, fileName);
            fs.stat(file, function(err, stat) {                
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push({
                        path: file,
                        name: fileName
                    });
                    next();
                }
            });
        })();
    });
};

walk(folder, function(err, results) {
    if (err) throw err;
    const doubles = {};

    results.forEach((file) => {
        results.forEach((otherFile) => {
            if (
                file.path !== otherFile.path &&
                file.name === otherFile.name
            ) {
                if (!doubles[file.name]) {
                    doubles[file.name] = [file.path, otherFile.path];
                } else {
                    doubles[file.name].push(otherFile.path);
                }
            }
        });
    });

    console.log(doubles);

});