// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// const myExtension = require('../extension');

// we can either use test() or it() -- matter of style for team/project convention

describe('Extension Test Suite', () => {
	beforeEach(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	it('Sample test', () => {
		expect([1, 2, 3].indexOf(5)).toBe(-1);
		expect([1, 2, 3].indexOf(0)).toBe(-1);
		expect([1, 2, 3].indexOf(1)).toBe(0);
	});
});
