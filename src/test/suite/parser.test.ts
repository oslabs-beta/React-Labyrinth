import { Parser } from '../../parser';
import * as path from 'path';
import { beforeEach, expect, test } from '@jest/globals'; 

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// const myExtension = require('../extension');

describe('Parser Test Suite', () => {
    let parser, tree, file;
    const fs = require('fs');


	// UNPARSED TREE TEST
    xdescribe('It initializes correctly', () => {
        beforeEach(() => {
            // Assign the test file and make new instance of Parser
            file = path.join(__dirname, '../test_cases/tc_0/index.js');
            // file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
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
    xdescribe('It works for simple apps', () => {
        beforeEach(() => {
            file = path.join(__dirname, '');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('It returns an defined object tree when parsed', () => {
            expect(tree).toBeDefined();
            //expect(tree).toMatchObject()
        });

        // test('Parsed tree has a property called name with value index and one child with name App', () => {

        // });
    });

    // TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
    describe('Catches bad imports', () => {
        beforeEach(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_6/component/App.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test("Child component with bad file path does not show up on the node tree", () => {
            expect(tree.children.length).toBe(0);
        })
    })

    // TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR
    describe('Parser should not work for components with syntax errors in the code', () => {
        beforeEach(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_7/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });
        
        test("Parser stops parsing when there is a syntax error in a component", () => {
            expect(tree.children.length).toBe(0);
        });
    })

    // these are the 14 tests we need to test for

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
	// TEST 12: NEXT.JS APPS (pages version & app router version)
  	// TEST 13: Variable Declaration Imports and React.lazy Imports    
    // TEST 14: CHECK IF COMPONENT IS CLIENT OR SERVER (USING HOOKS & DIRECTIVES) => BOOLEAN (priority)

    // LOU is doing EXTENSION TEST in extension.test.ts
});
