const {app, BrowserWindow, Menu} = require("electron");
const url = require("url");
const path = require("path");
const express = require("express");

if (process.env.NODE_ENV !== "production") {
	require("electron-reload")(__dirname, {
		electron: path.join(__dirname, "../node_modules", ".bin", "electron")
	});
}

app.on("ready", () => {	
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file",
		slashes: true,
	}));

	const mainMenu = Menu.buildFromTemplate([]);
	Menu.setApplicationMenu(mainMenu);
});

const webapp = express();

webapp.get("/", (req, res)=> {
	res.send("xd");
});

webapp.listen(3000, ()=> {
	console.log("server started");
});