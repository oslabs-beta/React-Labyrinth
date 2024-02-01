import { Parser } from '../../parser';
import * as path from 'path';
import { beforeEach, expect, test } from '@jest/globals'; 

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// const myExtension = require('../extension');

describe('Parser Test Suite', () => {
    let parser, tree, file;

	// UNPARSED TREE TEST
    describe('It initializes correctly', () => {
        beforeEach(() => {
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
        beforeEach(() => {
            file = path.join(__dirname, '');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('It returns an defined object tree when parsed', () => {
            expect(tree).toBeDefined();
        });
    });

    // TEST 8: MULTIPLE PROPS ON ONE COMPONENT
    describe('Finds multiple props in one component', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_8/components/App.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        })

        test('Should have children', () => {
            expect(tree.children).toHaveLength(1);
            const child = tree.children[0];
            expect(child.name).toEqual('Main');
            expect(child.props).toHaveProperty('name');
            expect(child.props).toHaveProperty('age');
            expect(child.props).toHaveProperty('DOB');
        })
    })

    // TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS
    describe('Finds different props across two or more identical components.', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_9/components/App.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        })

        test('Should have children', () => {
            expect(tree.children).toHaveLength(1);
        })

        test('Child should have different props', () => {
            const child = tree.children[0].props;
            expect(child.name).toEqual(true);
            expect(child.differentName).toEqual(true);
        })
    })
	
	// TEST 10: CHECK CHILDREN WORKS AND COMPONENTS WORK
    xdescribe('Finds different props across two or more identical components.', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_10/components/App.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        })

        test('Should have children', () => {
            expect(tree.children).toHaveLength(1);
        })

        test('Child should have different props', () => {
            const child = tree.children[0].props;
            expect(child.name).toEqual(true);
            expect(child.differentName).toEqual(true);
        })
    })
});
