// import * as assert from 'assert' -- this one is from node
import { Parser } from '../../parser';
import * as path from 'path';
import { beforeEach, beforeAll, expect, test } from '@jest/globals'; 

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// const myExtension = require('../extension');

describe('Parser Test Suite', () => {
    let parser, tree, file;

	// UNPARSED TREE TEST
    describe('It initializes correctly', () => {
        beforeEach(() => {
            // declare var and assign it to a test file and make new instance of Parser
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_0/index.js');
            parser = new Parser(file);
        });

        test('It instantiates an object for the parser class', () => {
            expect((parser)).toBeInstanceOf(Parser);
        });

        test('It begins with a suitable entry file and a tree that is not yet defined', () => {
            expect(parser.entryFile).toEqual(file);
            expect(tree).toBeUndefined();
        });
    });

	// TEST 0: ONE CHILD
    describe('It works for simple apps', () => {
        beforeAll(() => {
            // console.log('-----test 0----------')
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_0/index.js');
            parser = new Parser(file);
            tree = parser.parse();
            console.log('tree', tree);
        });

        test('It returns an defined object tree when parsed', () => {
            expect(tree).toBeDefined();
            expect(typeof(tree)).toBe('object');
        });

        test('Parsed tree has a property called name with value index and one child with name App', () => {
            expect(tree).toHaveProperty('name', 'index');
            // console.log('--------------index---------');
            expect(tree.children[0]).toHaveProperty('name', 'App');
        });
    });

	// TEST 1: NESTED CHILDREN

    describe('It checks for nested Children', () => {
        beforeEach(() => {
            file = path.join(__dirname, '../../../../test_cases/tc_1/index.js');
            // file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
            parser = new Parser(file);
        })

        console.log('inside Test 1')
    })


	// TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS
	// TEST 3: IDENTIFIES REDUX STORE CONNECTION
	// TEST 4: ALIASED IMPORTS
	// TEST 5: MISSING EXTENSIONS AND UNUSED IMPORTS

    // ashley
	// TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
	// TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR
	// TEST 8: MULTIPLE PROPS ON ONE COMPONENT
	// TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS

	// TEST 10: CHECK CHILDREN WORKS AND COMPONENTS WORK
	// TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
	// TEST 12: NEXT.JS APPS (pages version & app router version)
  	// TEST 13: Variable Declaration Imports and React.lazy Imports    
    // TEST 14: CHECK IF COMPONENT IS CLIENT OR SERVER (USING HOOKS) => RENDERS A CERTAIN COLOR (priority)

    // LOU - EXTENSION TEST 
});
