// Convergência: janela do jogo + atualização automática pelo GitHub Releases
const { app, BrowserWindow, dialog, Menu } = require('electron');
const path = require('path');
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) {}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1100, minHeight: 700,
    backgroundColor: '#0e0f15', title: `Convergência ${app.getVersion()}`,
    autoHideMenuBar: true, webPreferences: { contextIsolation: true }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.type === 'keyDown' && input.key === 'F12') win.webContents.toggleDevTools();
  });
  return win;
}

function setupUpdates(win) {
  if (!autoUpdater || !app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('update-available', info => {
    win.setTitle(`Convergência ${app.getVersion()} — baixando a versão ${info.version}...`);
  });
  autoUpdater.on('update-downloaded', async info => {
    win.setTitle(`Convergência ${app.getVersion()}`);
    const r = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['Atualizar agora', 'Depois'], defaultId: 0, cancelId: 1,
      title: 'Nova versão do Convergência',
      message: `A versão ${info.version} está pronta.`,
      detail: 'O jogo vai fechar e abrir de novo já atualizado.'
    });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', () => win.setTitle(`Convergência ${app.getVersion()}`));
  autoUpdater.checkForUpdates().catch(() => {});
}

app.whenReady().then(() => { const win = createWindow(); setupUpdates(win); });
app.on('window-all-closed', () => app.quit());
