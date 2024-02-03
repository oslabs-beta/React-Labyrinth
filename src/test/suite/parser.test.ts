import { Parser } from '../../parser';
import * as path from 'path';
import { beforeAll, expect, test } from '@jest/globals'; 

describe('Parser Test Suite', () => {
    let parser, tree, file;

	// TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
    describe('It should render the second call of mutually recursive components, but no further', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_11/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('Tree should not be undefined', () => {
            expect(tree).toBeDefined();
        });

        test('Tree should have an index component while child App1, grandchild App2, great-grandchild App1', () => {
            expect(tree).toHaveProperty('name', 'index');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0]).toHaveProperty('name', 'App1');
            expect(tree.children[0].children).toHaveLength(1);
            expect(tree.children[0].children[0]).toHaveProperty('name', 'App2');
            expect(tree.children[0].children[0].children).toHaveLength(1);
            expect(tree.children[0].children[0].children[0]).toHaveProperty('name', 'App1');
            expect(tree.children[0].children[0].children[0].children).toHaveLength(0);
        });
    });

	// TEST 12A: NEXT.JS APPS (PAGES ROUTER)
    describe('It should parse Next.js applications using Pages Router', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_12a/pages/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('Root should be named index, children should be named Head and Navbar, children of Navbar should be named Link and Image', () => {
            expect(tree).toHaveProperty('name', 'index');
            expect(tree.children).toHaveLength(2);
            expect(tree.children[0]).toHaveProperty('name', 'Head');
            expect(tree.children[1]).toHaveProperty('name', 'Navbar');

            expect(tree.children[1].children).toHaveLength(2);
            expect(tree.children[1].children[0]).toHaveProperty('name', 'Link');
            expect(tree.children[1].children[1]).toHaveProperty('name', 'Image');
        });
    });

    // TEST 12B: NEXT.JS APPS (APP ROUTER)
    describe('It should parser Next.js applications using Apps Router', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_12b/app/page.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        });

         test('Root should be named page, it should have one child named Homepage', () => {
			expect(tree).toHaveProperty('name', 'page');
			expect(tree.children).toHaveLength(1);
			expect(tree.children[0]).toHaveProperty('name', 'HomePage');
		});
    });
    
  	// TEST 13: VARIABLE DECLARATION IMPORTS AND REACT.LAZY IMPORTS 
    describe('It should parse VariableDeclaration imports including React.lazy imports', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_13/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('Root should be named index, it should have one child named App', () => {
			expect(tree).toHaveProperty('name', 'index');
			expect(tree.children).toHaveLength(1);
			expect(tree.children[0]).toHaveProperty('name', 'App');
		});

        test('App should have three children, Component1, Component2 and Component3, all found successfully', () => {
			expect(tree.children[0].children[0]).toHaveProperty('name', 'Component1');
            expect(tree.children[0].children[0]).toHaveProperty('thirdParty', false);

			expect(tree.children[0].children[1]).toHaveProperty('name', 'Component2');
            expect(tree.children[0].children[1]).toHaveProperty('thirdParty', false);

            expect(tree.children[0].children[2]).toHaveProperty('name', 'Component3');
            expect(tree.children[0].children[2]).toHaveProperty('thirdParty', false);
		});
    }); 

    // TEST 14: CHECK IF COMPONENT IS A CLIENT COMPONENT USING HOOKS AND DIRECTIVES
    describe('It should parse components and determine if the component type', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_14/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('Root should be named index, it should have one children named App', () => {
            expect(tree).toHaveProperty('name', 'index');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0]).toHaveProperty('name', 'App');
        });

        test('App should have three children, Component1, Component4, Component5 is a client component using hooks, Component2 is a client component using directives, and Component3, Component6, Component7 is not a client component', () => {
            expect(tree.children[0].children[0]).toHaveProperty('name', 'Component1');
            expect(tree.children[0].children[0]).toHaveProperty('isClientComponent', true);

			expect(tree.children[0].children[1]).toHaveProperty('name', 'Component2');
            expect(tree.children[0].children[1]).toHaveProperty('isClientComponent', true);

            expect(tree.children[0].children[2]).toHaveProperty('name', 'Component3');
            expect(tree.children[0].children[2]).toHaveProperty('isClientComponent', false);

            expect(tree.children[0].children[3]).toHaveProperty('name', 'Component4');
            expect(tree.children[0].children[3]).toHaveProperty('isClientComponent', true);

            expect(tree.children[0].children[4]).toHaveProperty('name', 'Component5');
            expect(tree.children[0].children[4]).toHaveProperty('isClientComponent', true);

            expect(tree.children[0].children[5]).toHaveProperty('name', 'Component6');
            expect(tree.children[0].children[5]).toHaveProperty('isClientComponent', false);

            expect(tree.children[0].children[6]).toHaveProperty('name', 'Component7');
            expect(tree.children[0].children[6]).toHaveProperty('isClientComponent', false);
        });
    });
});
