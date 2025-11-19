 # Localserv
 
 ![Localserv Logo](https://img.shields.io/badge/Localserv-Static%20Server-blue) ![Windows](https://img.shields.io/badge/platform-Windows-lightgrey) ![License](https://img.shields.io/badge/license-MIT-green)
 
 **A desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.**
 
 ---
 
 
 ## Overview
 
 Localserv is a desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.
 
 I built this because I was tired of running `python -m http.server` or setting up a full Node environment just to preview a simple HTML file. This tool wraps a real Express server in a clean Electron GUI so you can test your projects in a production-like environment without the command line.
 
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
 
 - [Node.js](https://nodejs.org/) (v14 or higher)
 - npm (comes with Node.js)
 
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
 - Window creation
 - IPC communication
 - System integration
 
 #### Renderer Process (`renderer.js`)
 
 Handles:
 - UI interactions
 - Express server management
 - Log display
 
 #### Styling (`styles.css`)
 
 Uses Tailwind CSS for:
 - Responsive layout
 - Dark mode theme
 - Modern UI components
 
 ---

 ## Support
 
 If this tool saved you some time, feel free to [buy me a coffee](https://buymeacoffee.com/nicholasxdavis) ☕

 ---
 
 ## License
 
 MIT License
 
 Copyright (c) 2024 Localserv
 
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
 
 [![Star History Chart](https://api.star-history.com/svg?repos=nicholasxdavis/localserv&type=Date)](https://star-history.com/#nicholasxdavis/localserv&Date)
 
 ---
 
 
 **Made with ❤️ for developers who just want to preview their HTML files without cors issues.**
 
 ---
 
