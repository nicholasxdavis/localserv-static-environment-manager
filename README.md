 # Localserv
 
 ![Localserv Logo](https://img.shields.io/badge/Localserv-Static%20Server-blue) ![Windows](https://img.shields.io/badge/platform-Windows-lightgrey) ![License](https://img.shields.io/badge/license-MIT-green)
 
 **A desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.**
 
 ---
 
 **Table of Contents**
 
 [TOC]
 
 ---
 
 ## Overview
 
 Localserv is a desktop utility for Windows that lets you instantly serve static websites from any folder on your computer.
 
 I built this because I was tired of running `python -m http.server` or setting up a full Node environment just to preview a simple HTML file. This tool wraps a real Express server in a clean Electron GUI so you can test your projects in a production-like environment without the command line.
 
 ---
 
 ## Features
 
 - **Zero Config**: No config files or command line flags. It just works.
 - **Port Finding**: Automatically finds a free port so you never get "EADDRINUSE" errors.
 - **Live Logs**: See server activity directly in the app window. Useful for debugging broken image links or script paths.
 - **Smart Detection**: If you select a specific file (like `index.html`), it serves the parent folder and opens that specific file.
 - **Clean UI**: A modern dark-mode interface that stays out of your way.
 
 ---
 
 ## Why Localserv?
 
 ### The Problem
 
 When developing static websites, you often need a local server to:
 - Test relative paths and routing
 - Preview HTML files with proper MIME types
 - Debug CORS issues
 - Simulate production environments
 
 Traditional solutions require:
 - Opening a terminal
 - Remembering commands like `python -m http.server`
 - Manually finding available ports
 - Dealing with cryptic error messages
 
 ### The Solution
 
 Localserv provides a **one-click solution** with:
 - ✅ No terminal required
 - ✅ Automatic port detection
 - ✅ Visual server logs
 - ✅ Production-like Express server
 - ✅ Beautiful, intuitive interface
 
 ---
 
 ## Installation
 
 ### Download Pre-built Executable
 
 1. Go to the [Releases](https://github.com/yourusername/localserv/releases) page
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
    git clone https://github.com/yourusername/localserv.git
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
 
 ## Usage
 
 ### Basic Usage
 
 1. **Launch Localserv**: Double-click `Localserv.exe`
 2. **Select a Folder**: Click "Choose Folder" and select your project directory
 3. **Start Server**: The server starts automatically on an available port
 4. **View in Browser**: Your default browser opens to `http://localhost:[port]`
 
 ### Advanced Features
 
 #### Serving a Specific File
 
 If you select a specific file (like `index.html`), Localserv will:
 - Serve the parent folder as the root
 - Automatically open that specific file in your browser
 
 #### Monitoring Server Activity
 
 The built-in log viewer shows:
 - HTTP requests (GET, POST, etc.)
 - Response status codes (200, 404, etc.)
 - File paths being accessed
 - Timestamps for debugging
 
 #### Port Management
 
 Localserv automatically:
 - Scans for available ports starting from 3000
 - Avoids port conflicts
 - Displays the active port in the UI
 
 ---
 
 ## Screenshots
 
 ### Main Interface
 
 ![Main Interface](screenshots/main-interface.png)
 
 > Clean, modern dark-mode interface
 
 ### Server Logs
 
 ![Server Logs](screenshots/server-logs.png)
 
 > Real-time server activity monitoring
 
 ### Folder Selection
 
 ![Folder Selection](screenshots/folder-selection.png)
 
 > Easy folder and file selection
 
 ---
 
 ## Tech Stack
 
 | Technology | Usage |
 | ------------- | ------------------------------ |
 | **Electron** | Desktop window wrapper |
 | **Express** | File serving logic |
 | **Portfinder** | Port allocation |
 | **Tailwind CSS** | Interface styling |
 
 ---
 
 ## Project Structure
 
 ```
 localserv/
 ├── main.js              # Electron main process
 ├── renderer.js          # UI logic and event handlers
 ├── index.html           # Application interface
 ├── package.json         # Dependencies and scripts
 ├── styles.css           # Tailwind CSS styles
 └── README.md           # This file
 ```
 
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
 
 ## Configuration
 
 ### Default Settings
 
 | Setting | Default Value | Description |
 | --------- | -----:| ------------------------------ |
 | Starting Port | 3000 | First port to try |
 | Max Port | 9000 | Maximum port to scan |
 | Auto-open Browser | Yes | Opens browser on server start |
 
 ### Customization
 
 You can modify these settings in `renderer.js`:
 
 ```javascript
 // Change starting port
 const startPort = 3000;
 
 // Disable auto-open browser
 const autoOpen = false;
 ```
 
 ---
 
 ## Troubleshooting
 
 ### Common Issues
 
 #### Port Already in Use
 
 **Problem**: Error message "EADDRINUSE"
 
 **Solution**: Localserv automatically finds the next available port. If this persists, check for other applications using ports 3000-9000.
 
 #### Server Won't Start
 
 **Problem**: Server fails to start after selecting folder
 
 **Solution**:
 - Ensure the folder exists and is accessible
 - Check folder permissions
 - Try running as administrator
 
 #### Browser Doesn't Open
 
 **Problem**: Server starts but browser doesn't open automatically
 
 **Solution**: Manually navigate to the URL shown in the app (e.g., `http://localhost:3000`)
 
 ---
 
 ## FAQ
 
 ### Q: Does this work on Mac or Linux?
 
 **A**: Currently, Localserv is built for Windows only. However, the source code can be adapted for other platforms using Electron's cross-platform capabilities.
 
 ### Q: Can I serve dynamic content (PHP, Node.js)?
 
 **A**: No, Localserv is designed for static files only (HTML, CSS, JavaScript, images, etc.). For dynamic content, use platform-specific servers.
 
 ### Q: Is this suitable for production?
 
 **A**: No, Localserv is a development tool. For production, use proper web servers like Nginx, Apache, or cloud hosting services.
 
 ### Q: How do I stop the server?
 
 **A**: Click the "Stop Server" button in the app, or simply close the application window.
 
 ---
 
 ## Roadmap
 
 - [ ] Cross-platform support (Mac, Linux)
 - [ ] Custom port selection
 - [ ] HTTPS support for testing secure contexts
 - [ ] Directory listing customization
 - [ ] Request/response header inspection
 - [ ] Export server logs
 - [ ] Multiple server instances
 - [ ] Browser selection (Chrome, Firefox, Edge)
 
 ---
 
 ## Contributing
 
 Contributions are welcome! Here's how you can help:
 
 1. **Fork the repository**
 2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
 3. **Commit your changes**: `git commit -m 'Add amazing feature'`
 4. **Push to the branch**: `git push origin feature/amazing-feature`
 5. **Open a Pull Request**
 
 ### Contribution Guidelines
 
 - Follow existing code style
 - Add comments for complex logic
 - Test thoroughly before submitting
 - Update documentation as needed
 
 ---
 
 ## Support
 
 If this tool saved you some time, feel free to [buy me a coffee](https://buymeacoffee.com/yourusername) ☕
 
 ### Get Help
 
 - 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/localserv/issues)
 - 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/localserv/discussions)
 - 📧 **Email**: support@localserv.dev
 
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
 
 ## Acknowledgments
 
 - Built with [Electron](https://www.electronjs.org/)
 - Powered by [Express](https://expressjs.com/)
 - Styled with [Tailwind CSS](https://tailwindcss.com/)
 - Port management by [Portfinder](https://github.com/http-party/node-portfinder)
 
 ---
 
 ## Star History
 
 [![Star History Chart](https://api.star-history.com/svg?repos=yourusername/localserv&type=Date)](https://star-history.com/#yourusername/localserv&Date)
 
 ---
 
 ## Related Projects
 
 - [http-server](https://github.com/http-party/http-server) - Command-line HTTP server
 - [live-server](https://github.com/tapio/live-server) - Development server with live reload
 - [serve](https://github.com/vercel/serve) - Static file serving by Vercel
 
 ---
 
 **Made with ❤️ for developers who just want to preview their HTML files without the hassle.**
 
 ---
 
 ### Quick Links
 
 - [Download Latest Release](https://github.com/yourusername/localserv/releases/latest)
 - [Report a Bug](https://github.com/yourusername/localserv/issues/new?template=bug_report.md)
 - [Request a Feature](https://github.com/yourusername/localserv/issues/new?template=feature_request.md)
 - [View Documentation](https://github.com/yourusername/localserv/wiki)
 
 ---
 
 *Last updated: 2024*
