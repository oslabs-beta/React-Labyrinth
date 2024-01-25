import * as path from 'path';
import { glob } from 'glob';
import * as jest from 'jest';

export async function run(): Promise<void> {
	try {
		console.log('inside try block of index.ts');

		const testsRoot = path.resolve(__dirname, '..');
		const files = await glob('**/**.test.js', { cwd: testsRoot });
	
		if (files.length === 0) {
			console.warn('No test files found');
			return;
		}

		console.log('test files: ', files);

		return new Promise(async (c, e) => {
			try {
				console.log('inside promise block of index.ts before await ')
				await jest.run([...files]);
				console.log('inside promise block of index.ts after await')
				c();
				console.log('inside promise block of index.ts after c()')
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}