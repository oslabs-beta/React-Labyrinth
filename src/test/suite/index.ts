import * as path from 'path';
// import * as Mocha from 'mocha';
import { glob } from 'glob';

// export async function run(): Promise<void> {
// 	// Create the mocha test
// 	const mocha = new Mocha.default({
// 		ui: 'tdd',
// 		color: true
// 	});

// 	const testsRoot = path.resolve(__dirname, '..');
// 	const files = await glob('**/**.test.js', { cwd: testsRoot });

// 	// Add files to the test suite
// 	files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

// 	try {
// 		return new Promise((c, e) => {
// 			// Run the mocha test
// 			mocha.run(failures => {
// 				if (failures > 0) {
// 					e(new Error(`${failures} tests failed.`));
// 				} else {
// 					c();
// 				}
// 			});
// 		});
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

import * as jest from 'jest';

export async function run(): Promise<void> {
	const testsRoot = path.resolve(__dirname, '..');
	const files = await glob('**/**.test.js', { cwd: testsRoot });

	try {
		return new Promise(async (c, e) => {
			try {
				await jest.run();
				c();
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}