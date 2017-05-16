//Opens all of the hotkey cheatsheets in my chrome bookmarks

const fs = require("fs"),
    homeDir = require("home-dir"),
    path = require("path"),
    opn = require("opn");

class Hotkeys {

    constructor() {
        this.openLinks();
    }

    openLinks() {
        this.readBookmarks().then((data) => {
            const urlList = this.constructUrlList(data);
            for(let url of urlList) {
                opn(url, {app: 'Safari'});
            }
            process.exit();
        }).catch((error) => {
            console.error("Unable to read the file due to error: " + error.stack);
        })
    }

    readBookmarks() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(homeDir(), "/Library/Application Support/Google/Chrome/Default/Bookmarks"),
                (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    constructUrlList(data) {
        const hotKeyBookmarks = this.getHotkeysBookmarks(data);
        return hotKeyBookmarks.map((hotKeyBookmark) => {
            return hotKeyBookmark.url;
        });
    }

    getHotkeysBookmarks(data) {
        const bookmarks = JSON.parse(data).roots.bookmark_bar.children;
        for(let folder of bookmarks) {
            if(folder.name.toLowerCase() === "hotkeys") {
                return folder.children
            }
        }
        console.error("sorry, there was no hotkeys folder found in your bookmarks!")
    }
}

new Hotkeys();
