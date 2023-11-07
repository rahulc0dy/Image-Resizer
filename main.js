const os = require("os");
const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const ResizeImg = require("resize-img");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;

// Create the window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // open devtools if in dev environment
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: "Image Resizer",
        width: 300,
        height: 400,
    });

    aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

// App is ready
app.whenReady().then(() => {
    createMainWindow();

    // Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Menu Template
const menu = [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      {
                          label: "About",
                          click: createAboutWindow,
                      },
                  ],
              },
          ]
        : []),
    {
        role: "fileMenu",
    },
    ...(!isMac
        ? [
              {
                  label: "Help",
                  submenu: [
                      {
                          label: "About",
                          click: createAboutWindow,
                      },
                  ],
              },
          ]
        : []),
];

ipcMain.on("image:resize", (e, options) => {
    options.dest = path.join(os.homedir(), "imageresizer");
    resizeImage(options);
});

async function resizeImage({ imagePath, width, height, dest }) {
    try {
        const newPath = await ResizeImg(fs.readFileSync(imagePath), {
            width: +width,
            height: +height,
        });
        const filename = path.basename(imagePath);
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        fs.writeFileSync(path.join(dest, filename), newPath);

        mainWindow.webContents.send("image:done");

        shell.openPath(dest);
    } catch (error) {
        console.log(error);
    }
}

app.on("window-all-closed", () => {
    if (!isMac) {
        app.quit();
    }
});
