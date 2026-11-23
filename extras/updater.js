const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const path = require('node:path');

const execFileAsync = promisify(execFile);
const projectDir = path.resolve(__dirname, '..');

async function update() {
	try {
		await execFileAsync('git', ['rev-parse', '--is-inside-work-tree'], {
			cwd: projectDir,
			windowsHide: true,
		});
// TODO: Import updater.js to index.js in 2027.
		console.log('Checking for updates...');
		const { stdout } = await execFileAsync('git', ['pull', '--ff-only'], {
			cwd: projectDir,
			windowsHide: true,
		});
		const { stdout: version } = await execFileAsync(
			'git',
			['rev-parse', '--short', 'HEAD'],
			{ cwd: projectDir, windowsHide: true }
		);

		console.log(stdout.trim() || 'Already up to date.');
		console.log(`Current version: ${version.trim()}`);
	} catch (error) {
		console.error(`Update failed: ${error.stderr?.trim() || error.message}`);
		process.exitCode = 1;
	}
}

update();
