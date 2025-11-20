![Localserv Header](https://private-user-images.githubusercontent.com/147455788/516580928-d4dbf481-def3-40e0-92ca-ba2bd67e85b0.png)

# Localserv

![Localserv Logo](https://img.shields.io/badge/Localserv-Static%20Server-blue) ![Windows](https://img.shields.io/badge/platform-Windows-lightgrey) ![License](https://img.shields.io/badge/license-MIT-green)

**A desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.**

---

## Overview

Localserv is a desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.

I built this because I was tired of running python -m http.server or setting up a full Node environment just to preview a simple HTML file. Opening HTML locally still triggers things like CORS restrictions. This tool embeds a real Express server inside a clean Electron interface, giving you a production-style environment for development and debugging without touching the terminal.

---

## Installation

### Download Pre-built Executable

1. Go to the [Releases](https://github.com/nicholasxdavis/localserv/releases) page
2. Download the latest `Localserv-win32-x64.zip`
3. Extract the ZIP file
4. Run `Localserv.exe`

### Build from Source

If you want to modify the code or run it from source, you need Node.js installed.

#### Prerequisites

* Node.js (v14 or higher)
* npm (comes with Node.js)

#### Steps

1. Clone this repository or download the files:

   ```bash
   git clone https://github.com/nicholasxdavis/localserv.git
   cd localserv
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npm start
   ```

---

## Building the Windows App (.exe)

To create a standalone `.exe` file you can share with others:

1. Run the build script:

   ```bash
   npm run build
   ```

2. Wait for the process to finish. It will create a new folder named `Localserv-win32-x64`.

3. Your executable `Localserv.exe` will be inside that folder.

---

## Development

### Running in Development Mode

```bash
npm start
```

This launches the Electron app with hot-reload enabled.

### Code Structure

#### Main Process (`main.js`)

Handles:

* Window creation
* IPC communication
* System integration

#### Renderer Process (`renderer.js`)

Handles:

* UI interactions
* Express server management
* Log display

#### Styling (`styles.css`)

Uses Tailwind CSS for:

* Responsive layout
* Dark mode theme
* Modern UI components

---

## Support

If this tool saved you some time, feel free to buy me a coffee ☕

---

## License

MIT License

Copyright (c) 2024 Localserv

Permission is hereby granted...

---

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=nicholasxdavis/localserv\&type=Date)

---

**Made for developers who just want to preview their HTML files without CORS issues.**
