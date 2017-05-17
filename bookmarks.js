//Opens all of the hotkey cheatsheets in my chrome bookmarks

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
        this.readBookmarks().then((data) => {
            const urlList = this.constructUrlList(data);
            const appArg = args[1];
            for(let url of urlList) {
                opn(url, {app: appArg || "Safari"});
            }
            process.exit();
        }).catch((error) => {
            console.error("Unable to read the file due to error: " + error.stack);
        })
    }

    constructUrlList(data) {
        const bookmarks = this.getBookmarks(data);
        return bookmarks.map((bookmark) => {
            return bookmark.url;
        });
    }

    readBookmarks() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(homeDir(), "/Library/Application Support/Google/Chrome/Default/Bookmarks"),
                (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    getBookmarks(data) {
        const bookmarks = JSON.parse(data).roots.bookmark_bar.children;
        for(let folder of bookmarks) {
            const folderName = folder.name.toLowerCase();
            if(folderName === folderArg || folderName === "hotkeys") {
                return folder.children
            }
        }
        console.error("sorry, the specified folder was not found!");
    }

}

new BookMarks();
