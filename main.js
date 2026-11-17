// Convergência: janela do jogo + botão Atualizar (baixa o jogo novo do GitHub, sem reinstalar)
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const REPO_RAW = process.env.CVG_RAW || 'https://raw.githubusercontent.com/BrunoRamanery/convergente-/main/app/';
const BUNDLED = path.join(__dirname, 'app');
const contentDir = () => path.join(app.getPath('userData'), 'conteudo');

const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const sha1 = f => { try { return crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex'); } catch (e) { return null; } };
const newer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };

// qual versão do jogo abrir: a baixada pelo botão Atualizar (se for mais nova) ou a que veio no instalador
function currentContent() {
  const bundled = readJSON(path.join(BUNDLED, 'manifest.json')) || { version: '0.0.0' };
  const dl = readJSON(path.join(contentDir(), 'manifest.json'));
  if (dl && newer(dl.version, bundled.version) && fs.existsSync(path.join(contentDir(), 'index.html')))
    return { dir: contentDir(), version: dl.version };
  return { dir: BUNDLED, version: bundled.version };
}

async function download(url, dest) {
  const r = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' em ' + url);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest + '.tmp', buf); fs.renameSync(dest + '.tmp', dest);
}

// botão Atualizar: compara a versão do GitHub com a atual e baixa só os arquivos que mudaram
ipcMain.handle('cvg-update', async (e) => {
  const cur = currentContent();
  const r = await fetch(REPO_RAW + 'manifest.json?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) throw new Error('Não achei a versão no GitHub (HTTP ' + r.status + ')');
  const remote = await r.json();
  if (!newer(remote.version, cur.version)) return { updated: false, version: cur.version };
  const dir = contentDir(); fs.mkdirSync(dir, { recursive: true });
  const files = Object.entries(remote.files); let done = 0;
  for (const [name, hash] of files) {
    const dest = path.join(dir, name);
    if (sha1(dest) !== hash) {
      const local = [path.join(cur.dir, name), path.join(BUNDLED, name)].find(f => sha1(f) === hash);
      if (local) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(local, dest); }
      else await download(REPO_RAW + name.split('/').map(encodeURIComponent).join('/'), dest);
    }
    done++; e.sender.send('cvg-progress', Math.round(done / files.length * 100));
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(remote));
  return { updated: true, version: remote.version };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1100, minHeight: 700,
    backgroundColor: '#0e0f15', title: 'Convergência',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.js') }
  });
  Menu.setApplicationMenu(null);
  const cur = currentContent();
  win.setTitle(`Convergência ${cur.version}`);
  win.loadFile(path.join(cur.dir, 'index.html'));
  win.on('page-title-updated', e => e.preventDefault());
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.type === 'keyDown' && input.key === 'F12') win.webContents.toggleDevTools();
  });
  return win;
}

// depois de atualizar, o jogo abre de novo já na versão nova
ipcMain.handle('cvg-reload', (e) => { const win = BrowserWindow.fromWebContents(e.sender), c = currentContent();
  win.setTitle(`Convergência ${c.version}`); win.loadFile(path.join(c.dir, 'index.html')); });

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
