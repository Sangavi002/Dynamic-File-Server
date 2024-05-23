const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        fs.readdir(__dirname, (err, result) => {
            if (err) {
                console.error(err);
            }

            const links = result.map(e => {
                const itemPath = path.join(__dirname, e);
                const isDirectory = fs.lstatSync(itemPath).isDirectory();
                const icon = isDirectory ? '&#128193;' : '&#128196;';
                return `<li>${icon} <a href="${e}">${e}</a></li>`;
            }).join('');
            res.end(`<html><body><ul>${links}</ul></body></html>`);
        });
    } else {
        const newPath = path.join(__dirname, decodeURIComponent(req.url));

        fs.stat(newPath, (err, result) => {
            if (result.isFile()) {
                fs.readFile(newPath, (err, data) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(data);
                });
            } else {
                res.end('<h1>404 Not Found</h1>');
            }
        });
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000.");
});
