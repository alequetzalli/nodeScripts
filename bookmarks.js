const fs = require("fs"),
    homeDir = require("home-dir"),
    path = require("path"),
    opn = require("opn"),
    args = process.argv.slice(2);

let folderArg, appArg;

if(args.length) {
    folderArg = args[0].toLowerCase();
    appArg = args[1];
}

class BookMarks {

    constructor() {
        this.openLinks();
    }

    openLinks() {
        this.readBookmarks().then(data => {
            const urlList = this.constructUrlList(data);
            console.log(urlList);
            for(let url of urlList) {
                //opn(url, {app: appArg || "Google Chrome"});
            }
            process.exit();
        }).catch(error => {
            console.error("Unable to read the file due to error: " + error.stack);
        })
    }

    constructUrlList(data) {
        const bookmarks = this.findSpecifiedFolder(data).children;
        return bookmarks.map(bookmark => {
            return bookmark.url;
        });
    }

    readBookmarks() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.osPaths(),
                (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    constructBookmarksList(data) {
        const folder = this.findSpecifiedFolder(data);
        let bookmarks = [];
    }

    findSpecifiedFolder(data) {
        const bookmarksBar = JSON.parse(data).roots.bookmark_bar.children;
        return this.recursiveSearch(bookmarksBar);
    }

    osPaths() {
        // paths are correct but apparently opn module does not work well with windows os
        const paths = {
            win32: path.join(homeDir(), "/AppData/Local/Google/Chrome/User Data/Default/Bookmarks") ,
            darwin: path.join(homeDir(), "/Library/Application Support/Google/Chrome/Default/Bookmarks")
    	};

    	for(let path in paths) {
            if(process.platform === path) {
                return paths[path]
            }
        }
    }

    recursiveSearch(bookmarksBar) {
        let result;
        const search = folderArray => {
            for(let folder of folderArray) {
                const folderName = folder.name.toLowerCase();
                if(folderName === folderArg.toLowerCase()) {
                    result = folder
                }
                else if(folder.children) {
                    search(folder.children);
                }
            }
            return result
        };
        return search(bookmarksBar);
    }

}

new BookMarks();