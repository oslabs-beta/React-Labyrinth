// import * as assert from 'assert' -- this one is from node
import { Parser } from '../../parser';
import * as path from 'path';
import { beforeEach, expect, test } from '@jest/globals'; 

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// const myExtension = require('../extension');

describe('Parser Test Suite', () => {
	// beforeEach(() => {
    //     vscode.window.showInformationMessage('Start all tests.');
    // });

    let parser, tree, file;

	// UNPARSED TREE TEST
    describe('It initializes correctly', () => {
        beforeEach(() => {
            // declare var and assign it to a test file and make new instance of Parser
            // both of the paths below work
            // file = path.join(__dirname, '../test_cases/tc_0/index.js');
            file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
            parser = new Parser(file);
        });

        test('It instantiates an object for the parser class', () => {
            expect((parser)).toBeInstanceOf(Parser);
            // assert.typeOf(parser, 'object', 'Value of new instance should be an object');
            // expect(parser).to.be.an('object');
        });

        test('It begins with a suitable entry file and a tree that is not yet defined', () => {
            expect(parser.entryFile).toEqual(file);
            expect(tree).toBeUndefined();
            // below is my code
            // assert.strictEqual(parser.entryFile, file, 'These files are strictly equal');
            // assert.isUndefined(tree, 'Tree is defined');
        });
    });

    // TEST ?: UNPARSED TREE TEST FOR REACT 18(createRoot)

	// TEST 0: ONE CHILD
    // describe('It works for simple apps', () => {
    //     before(() => {
    //         file = path.join(__dirname, '');
    //         parser = new Parser(file);
    //         tree = parser.parse();
    //     });

    //     test('It returns an defined object tree when parsed', () => {
    //         assert.typeOf(tree, 'object', 'Value of parse() on new instance should be an object');
    //     });
    // });

    // TEST 0.5: CHECK IF COMPONENT IS CLIENT OR SERVER (USING HOOKS) => RENDERS A CERTAIN COLOR
	// TEST 1: NESTED CHILDREN
	// TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS
	// TEST 3: IDENTIFIES REDUX STORE CONNECTION
	// TEST 4: ALIASED IMPORTS
	// TEST 5: MISSING EXTENSIONS AND UNUSED IMPORTS
	// TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
	// TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR
	// TEST 8: MULTIPLE PROPS ON ONE COMPONENT
	// TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS
	// TEST 10: CHECK CHILDREN WORKS AND COMPONENTS WORK
	// TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
	// TEST 12: NEXT.JS APPS (pages & app router)
  	// TEST 13: Variable Declaration Imports and React.lazy Imports
});