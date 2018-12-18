const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
	.then(createWindowsInstaller)
	.catch((error) => {
		console.log(error.message || error)
		process.exit(1)
	})
	
function getInstallerConfig() {
	console.log('creating windows installer')
	const rootPath = path.join('./')
	const outPath = path.join(rootPath, 'release-builds')
	
	return Promise.resolve({
		name: "XenoApp",
		appDirectory: path.join(outPath, 'XenoApp-win32-ia32/'),
		authors: 'Xeno',
		noMsi: true,
		outputDirectory: path.join(outPath, 'windows-installer'),
		exe: 'xenoapp.exe',
		setupExe: 'xenoappInstaller.exe',
		setupIcon: path.join(rootPath, 'assets', 'icons', 'xenoicon.ico'),
		iconUrl: 'http://xenoapp.com/wp-content/uploads/2018/11/xenoicon.ico',
		loadingGif: path.join(rootPath, 'assets', 'Xeno-Installing-Recovered.gif')
	})
}