import * as path from 'path';
import { glob } from 'glob';
import * as jest from 'jest';

export async function run(): Promise<void> {
	try {
		const testsRoot = path.resolve(__dirname, '..');
		const files = await glob('**/**.test.js', { cwd: testsRoot });
	
		if (files.length === 0) {
			console.warn('No test files found');
			return;
		}

		return new Promise(async (c, e) => {
			try {
				await jest.run([...files]);
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