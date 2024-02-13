import { Parser } from '../../parser';
import * as path from 'path';
import { beforeAll, beforeEach, expect, test } from '@jest/globals'; 

describe('Parser Test Suite', () => {
    let parser, tree, file;
    const fs = require('fs');

	// TEST 0: ONE CHILD
    describe('It works for simple apps', () => {
        beforeAll(() => {
            // console.log('-----test 0----------')
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_0/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        });

        test('Tree should not be undefined', () => {
            expect(tree).toBeDefined();
            expect(typeof(tree)).toBe('object');
        });

        test('Parsed tree has a property called name with value index, and a child with the name App', () => {
            expect(tree).toHaveProperty('name', 'index');
            expect(tree.children[0]).toHaveProperty('name', 'App');
        });
    });

    // these are the 14 tests we need to test for

	// TEST 1: NESTED CHILDREN

    describe('It checks for nested Children', () => {
        beforeEach(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_1/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        })

        test('Parsed tree should have a property called name with the value index, and one child with name App, which has its own child, Main', () => {
            expect(tree).toHaveProperty('name', 'index');
            expect(tree.children[0]).toHaveProperty('name', 'App');
            // console.log(tree.children[0].children);
            expect(tree.children[0].children[0]).toHaveProperty('name', 'Main');
        })

        test('Parsed tree has correct amount of child components', () => {
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].children).toHaveLength(1);
        })

        test('Parsed tree depth is accurate', () => {
            expect(tree).toHaveProperty('depth', 0);
            expect(tree.children[0]).toHaveProperty('depth', 1);
            expect(tree.children[0].children[0]).toHaveProperty('depth', 2);
        })
    })

    // TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS
    describe('It works for third party, React Router, and destructured imports', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_2/index.js');
            parser = new Parser(file);
            tree = parser.parse();
        })

        test('Should parse destructured and third party imports', () => {
            expect(tree).toHaveProperty('thirdParty', false);
            expect(tree.children[0]).toHaveProperty('thirdParty', true);
            expect(tree.children[1]).toHaveProperty('thirdParty', true);
            
            try {
                expect(tree.children[0].name).toContain('Switch')
            } catch {
                expect(tree.children[0].name).toContain('Route')
                
            }
            try {
                expect(tree.children[1].name).toContain('Switch')
            } catch {
                expect(tree.children[1].name).toContain('Route')
                
            }
        })

        test('third party should be reactRouter', () => {
            expect(tree.children[0]).toHaveProperty('reactRouter', true);
            expect(tree.children[1]).toHaveProperty('reactRouter', true);
        })
        
    }) 


    // TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
    describe('Catches bad imports', () => {
        beforeEach(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_6/component/App.jsx');
            parser = new Parser(file);
            tree = parser.parse();
        });
    
        test("Child component with bad file path does not show up on the node tree", () => {
            expect(tree.children.length).toBe(0);
        });
    });
    
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
    });

	// TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
    describe('It should render the second call of mutually recursive components, but no further', () => {
        beforeAll(() => {
            file = path.join(__dirname, '../../../../src/test/test_cases/tc_11/index.js');
            parser = new Parser(file);
            tree = parser.parse();
            // console.log('tree11', tree);
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




	// TEST 3: IDENTIFIES REDUX STORE CONNECTION
	// TEST 4: ALIASED IMPORTS
	// TEST 5: MISSING EXTENSIONS AND UNUSED IMPORTS

	// TEST 8: MULTIPLE PROPS ON ONE COMPONENT
	// TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS
	
    // LOU is doing EXTENSION TEST in extension.test.ts
    
});
