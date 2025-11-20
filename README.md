![Localserv Header](https://raw.githubusercontent.com/nicholasxdavis/BN-db1/cbc9f4ae9786c0f4af6147ea882b93c5ac5d76aa/img/Screenshot%202025-11-19%20185650.png)

# Localserv

![Localserv Logo](https://img.shields.io/badge/Localserv-Local%20Server-blue) ![Windows](https://img.shields.io/badge/platform-Windows-lightgrey) ![License](https://img.shields.io/badge/license-MIT-green)

**A desktop utility for Windows that lets you instantly serve websites or projects from any folder on your computer.**

---

## Overview

Localserv is a desktop utility for Windows that lets you instantly serve websites or modern frontend builds (like Vue, React, or Vite) from any folder on your computer.

I built this because I was tired of running python -m http.server or setting up a full Node environment just to preview a simple HTML file. Opening HTML locally still triggers things like CORS restrictions. This tool embeds a real Express server inside a clean Electron interface, giving you a production-style environment for development and debugging without touching the terminal.

---

## Installation

### Download & Install (Windows)

1. Visit the **Releases** page.
2. Download the latest `setup.exe`.
3. Run the installer — it will launch the Electron installer automatically.
4. Once installation finishes, Localserv will open and you're ready to go.

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

<h3 align="left">Support:</h3>
<p><a href="https://www.buymeacoffee.com/galore"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="galore" /></a></p><br><br>

---

## License

MIT License

Copyright (c) 2025 Blacnova Development

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=nicholasxdavis/localserv\&type=Date)

---

**Made for developers who just want to preview their projects without CORS issues.**
