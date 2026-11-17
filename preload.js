// Ponte segura entre o jogo e o aplicativo: só expõe o botão Atualizar
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cvg', {
  update: (ver, onProgress) => {
    const h = (e, p) => onProgress && onProgress(p);
    ipcRenderer.on('cvg-progress', h);
    return ipcRenderer.invoke('cvg-update').finally(() => ipcRenderer.removeListener('cvg-progress', h));
  },
  reload: () => ipcRenderer.invoke('cvg-reload')
});
