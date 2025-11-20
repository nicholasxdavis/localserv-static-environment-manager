// --- Application State ---
const AppState = {
    isConsoleCollapsed: true,
    isServerRunning: false,
    currentPath: null
};

// --- DOM Cache ---
const UI = {
    main: document.getElementById('mainContent'),
    pathText: document.getElementById('pathText'),
    console: {
        wrap: document.getElementById('consoleWrap'),
        body: document.getElementById('console'),
        toggle: document.getElementById('consoleToggle'),
        icon: document.getElementById('toggleIcon'),
        status: document.getElementById('status')
    },
    btn: {
        select: document.getElementById('selectBtn'),
        run: document.getElementById('runBtn'),
        stop: document.getElementById('stopBtn'),
        consoleStop: document.getElementById('consoleStopBtn'),
        min: document.getElementById('minBtn'),
        close: document.getElementById('closeBtn'),
        github: document.getElementById('githubLink'),
        support: document.getElementById('supportBtn')
    }
};

// --- API Validation ---
if (!window.api) {
    console.error("⚠️ Electron API not available. Please run this app in Electron.");
    // Provide minimal fallback to prevent crashes
    window.api = {
        selectTarget: async () => ({ canceled: true }),
        startServer: async () => ({ success: false, error: 'Electron API not available' }),
        stopServer: async () => ({ success: false, error: 'Electron API not available' }),
        onServerLog: () => {},
        openExternal: () => {},
        minimize: () => {},
        close: () => {}
    };
}

// --- Logic & Handlers ---

const App = {
    init() {
        this.bindEvents();
        this.log('Localserv v1.0.0 ready.');
    },

    bindEvents() {
        // Window Controls
        UI.btn.min.addEventListener('click', () => window.api.minimize());
        UI.btn.close.addEventListener('click', () => window.api.close());
        
        // External Links
        UI.btn.github.addEventListener('click', () => window.api.openExternal('https://github.com/blacnova'));
        UI.btn.support.addEventListener('click', () => window.api.openExternal('https://blacnova.com'));

        // Core Actions
        UI.btn.select.addEventListener('click', this.handleSelect.bind(this));
        UI.btn.run.addEventListener('click', this.handleLaunch.bind(this));
        UI.btn.stop.addEventListener('click', this.handleStop.bind(this));
        UI.btn.consoleStop.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleStop();
        });

        // Console Toggle
        UI.console.toggle.addEventListener('click', this.toggleConsole.bind(this));

        // Server Logs
        if (window.api.onServerLog) {
            window.api.onServerLog((msg, type) => this.log(msg, type));
        }
    },

    toggleConsole() {
        AppState.isConsoleCollapsed = !AppState.isConsoleCollapsed;
        
        if (AppState.isConsoleCollapsed) {
            // Collapse
            UI.main.classList.remove('hidden');
            UI.console.wrap.classList.remove('flex-1');
            UI.console.wrap.classList.add('h-9');
            UI.console.icon.style.transform = 'rotate(-90deg)';
            UI.console.body.classList.add('hidden');
            UI.btn.consoleStop.classList.add('hidden');
        } else {
            // Expand
            UI.main.classList.add('hidden');
            UI.console.wrap.classList.remove('h-9');
            UI.console.wrap.classList.add('flex-1');
            UI.console.icon.style.transform = 'rotate(0deg)';
            UI.console.body.classList.remove('hidden');
            
            if (AppState.isServerRunning) {
                UI.btn.consoleStop.classList.remove('hidden');
                UI.btn.consoleStop.classList.add('flex');
            }
        }
    },

    async handleSelect() {
        const result = await window.api.selectTarget();
        if (!result.canceled && result.filePaths.length > 0) {
            AppState.currentPath = result.filePaths[0];
            
            // Update UI
            UI.pathText.textContent = AppState.currentPath;
            UI.pathText.classList.replace('text-zinc-500', 'text-zinc-200');
            
            UI.btn.run.classList.remove('hidden', 'flex'); // Reset
            UI.btn.run.classList.add('flex');
            UI.btn.stop.classList.add('hidden');
            
            // Morph "Browse" button
            UI.btn.select.innerHTML = 'Change';
            UI.btn.select.classList.replace('flex-1', 'w-24');
            UI.btn.select.classList.remove('flex-1');
            
            this.log(`Target set: ${AppState.currentPath}`);
            this.setStatus('READY', 'blue');
        }
    },

    async handleLaunch() {
        this.setStatus('STARTING...', 'yellow');
        this.log('Initializing Express engine...');

        const res = await window.api.startServer(AppState.currentPath);

        if (res.success) {
            AppState.isServerRunning = true;
            this.log(`Server active on port ${res.port}`, 'success');
            this.setStatus('RUNNING', 'green');

            // UI State: Running
            UI.btn.run.classList.replace('flex', 'hidden');
            UI.btn.stop.classList.replace('hidden', 'flex');
            UI.btn.select.disabled = true;
            UI.btn.select.classList.add('opacity-50', 'cursor-not-allowed');

            if (!AppState.isConsoleCollapsed) {
                UI.btn.consoleStop.classList.remove('hidden');
                UI.btn.consoleStop.classList.add('flex');
            }
        } else {
            // User-friendly error messages
            let errorMsg = res.error || 'An unknown error occurred';
            if (errorMsg.includes('ENOENT')) {
                errorMsg = 'The selected folder or file could not be found. Please verify the path and try again.';
            } else if (errorMsg.includes('EACCES') || errorMsg.includes('Permission denied')) {
                errorMsg = 'Access denied. You may need to run Localserv with administrator privileges.';
            } else if (errorMsg.includes('EADDRINUSE') || errorMsg.includes('port')) {
                errorMsg = 'The server port is already in use. Please close other applications or try again.';
            }
            this.log(`Error: ${errorMsg}`, 'error');
            this.setStatus('ERROR', 'red');
        }
    },

    async handleStop() {
        this.log('Stopping server instance...', 'info');
        const res = await window.api.stopServer();

        if (res.success) {
            AppState.isServerRunning = false;
            this.log('Server stopped.', 'info');
            this.setStatus('READY', 'blue');

            // UI State: Ready
            UI.btn.stop.classList.replace('flex', 'hidden');
            UI.btn.run.classList.replace('hidden', 'flex');
            UI.btn.consoleStop.classList.replace('flex', 'hidden');
            
            UI.btn.select.disabled = false;
            UI.btn.select.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    },

    log(msg, type = 'info') {
        const div = document.createElement('div');
        div.className = 'flex gap-2 animate-fade-in text-[11px]';
        
        const time = new Date().toLocaleTimeString('en-US', {hour12: false});
        let color = 'text-zinc-400';
        if (type === 'success') color = 'text-emerald-400';
        if (type === 'error') color = 'text-red-400';

        div.innerHTML = `<span class="text-zinc-600 shrink-0 select-none font-mono">[${time}]</span><span class="${color} font-mono">${msg}</span>`;
        UI.console.body.appendChild(div);

        // Contextual auto-expand on errors
        if ((type === 'error' || type === 'success') && AppState.isConsoleCollapsed) {
            this.toggleConsole();
        }
        
        UI.console.body.scrollTo({ top: UI.console.body.scrollHeight, behavior: 'smooth' });
    },

    setStatus(text, colorName) {
        const colors = {
            blue: 'text-blue-400',
            green: 'text-emerald-400',
            red: 'text-red-400',
            yellow: 'text-yellow-400'
        };
        UI.console.status.textContent = text;
        UI.console.status.className = `text-[10px] font-medium ${colors[colorName] || 'text-zinc-600'}`;
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());

