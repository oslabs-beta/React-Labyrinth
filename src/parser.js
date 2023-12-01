const fs = require('fs')
const path = require('path')
const babel = require('@babel/parser');
const { getNonce } = require('./getNonce.js');
// const { Tree } = require('./treeTemplates/tree.js')

// Parser2 is our old code
// class Parser2 {
//     constructor() {
//         this.ast = undefined;
//         this.entryFile = undefined;
//         this.arrList = [];
//         this.parentDirectoryPath = undefined;
//     }

//     async grabFile(file) {
//         try {
//             if (!file) {
//                 console.error('Invalid file parameter. Cannot process undefined.');
//                 return;
//             }

//             if (typeof file !== 'string') {
//                 file = path.resolve(file[0].fsPath);
//             }

//             const fileContent = fs.readFileSync(file, 'utf-8');
//             this.ast = babel.parse(fileContent, {
//                 sourceType: 'module',
//                 tokens: true,
//                 plugins: ['jsx', 'typescript'],
//             });
//             await this.traverseAST(this.ast);
//             console.log('Result of arrList: ', this.arrList);
//         } catch (error) {
//             console.error(`Error processing file: ${error}`)
//         }
//     }

//     // traverse the ast nodes, passing in node
//     // input: ast node (object)
//     // output ?
//     traverseAST(node) {
//         if (node.type === 'ImportDeclaration') {
//             // extract file name path 
//             const elementName = node.source.value;
//             if (elementName.startsWith('./') || elementName.startsWith('../')) {
//                 console.log('file path:', elementName)
//                 console.log('node import: ', node);
//                 // now with this list, we can call a func to determine if node is a client component? 
//                 this.arrList.push(elementName);
//                 return this.grabFile(elementName);
//             };

//             const result = getImports(node.program.body);
//             console.log(result, 'result');

//             /* this code only works for JSXElement types: has prop of .children, but not the one above
//             if (node.children) {
//                 // if node children exist, then recursively call the child nodes with this func
//                 for (const child of node.children) {
//                     await traverseAST(child);
//                 }
//             }*/
//         } else {
//             // recursively iterate through the other non-jsx types if the jsx node children doesnt exist 
//             for (const key in node) {
//                 if (node[key] && typeof node[key] === 'object' && key !== 'tokens') {
//                     this.traverseAST(node[key]);
//                 }
//             }
//         }
//     }

//     // function to determine server or client component (can look for 'use client' and 'hooks')
//     // input: ast node (object)
//     // output: boolean
// checkForClientString(node) {
//     if (node.type === 'Directive') {
//         console.log('node', node);
//         // access the value property of the Directive node
//         console.log('Directive Value:', node.value);
//         // check if the node.value is a 'DirectiveLiteral' node
//         if (node.value && node.value.type === 'DirectiveLiteral') {
//             // check the value to see if it is 'use client'
//             if (typeof node.value.value === 'string' && node.value.value.trim() === 'use client') {
//                 // access the value property of the 'DirectiveLiteral' node
//                 console.log('DirectiveLiteral Value:', node.value.value);
//                 // might need to do something else here to make it known as client type
//                 return true;
//             }
//         }
//     }
//     return false;
// }

//     // function to determine if file uses react hooks (startswith 'use')
//     // input: ast node (object)
//     // output: boolean
// checkReactHooks(node) {
//     // for just the mvp, look up for the FIRST client component and make every child as a client component
//     // function to determine if component uses react hooks (checks if its BEING CALLED IN COMPONENT)
//     if (node.type === 'CallExpression') {
//         console.log('nodeCall', node)
//         if (node.callee && node.callee.name) {
//             // to be more specific, we might want to consider declaring an array of hooks and write logic to see if the array includes the node.calee.name, then return true
//             if (node.callee.name.startsWith('use')) {
//                 // if the node.type is CallExpression (dealing with function or method call) (callee is prop on callexpression - an identifier), return true
//                 console.log('node.callee', node.callee);
//                 console.log('Node with Hook', node.callee.name);
//                 return true;
//             }
//         }
//     }
//     return false;
// }
// }

class Parser {
    constructor(filePath) {
        // Fix when selecting files in wsl file system
        this.entryFile = filePath;
        if (process.platform === 'linux' && this.entryFile.includes('wsl$')) {
            this.entryFile = path.resolve(
                filePath.split(path.win32.sep).join(path.posix.sep)
            );
            this.entryFile = '/' + this.entryFile.split('/').slice(3).join('/');
            // Fix for when running wsl but selecting files held on windows file system
        } else if (
            process.platform === 'linux' &&
            /[a-zA-Z]/.test(this.entryFile[0])
        ) {
            const root = `/mnt/${this.entryFile[0].toLowerCase()}`;
            this.entryFile = path.join(
                root,
                filePath.split(path.win32.sep).slice(1).join(path.posix.sep)
            );
        }

        this.tree = undefined;
        // Break down and reasemble given filePath safely for any OS using path?
    }

    // method to generate component tree based on current entryFile
    parse() {
        // Create root Tree node
        const root = {
            id: getNonce(),
            name: path.basename(this.entryFile).replace(/\.(t|j)sx?$/, ''),
            fileName: path.basename(this.entryFile),
            filePath: this.entryFile,
            importPath: '/', // this.entryFile here breaks windows file path on root e.g. C:\\ is detected as third party
            expanded: false,
            depth: 0,
            count: 1,
            thirdParty: false,
            reactRouter: false,
            reduxConnect: false,
            children: [],
            parentList: [],
            props: {},
            error: '',
            isClientComponent: false, // might need to change this default value for the root file
        };

        this.tree = root;
        this.parser(root);
        return this.tree;
    }

    getTree() {
        return this.tree;
    }

    // Set Sapling Parser with a specific Data Tree (from workspace state)
    setTree(tree) {
        this.entryFile = tree.filePath;
        this.tree = tree;
    }

    updateTree(filePath) {
        let children = [];

        const getChildNodes = (node) => {
            const { depth, filePath, expanded } = node;
            children.push({ depth, filePath, expanded });
        };

        const matchExpand = (node) => {
            for (let i = 0; i < children.length; i += 1) {
                const oldNode = children[i];
                if (
                    oldNode.depth === node.depth &&
                    oldNode.filePath === node.filePath &&
                    oldNode.expanded
                ) {
                    node.expanded = true;
                }
            }
        };

        const callback = (node) => {
            if (node.filePath === filePath) {
                node.children.forEach((child) => {
                    this.traverseTree(getChildNodes, child);
                });

                const newNode = this.parser(node);

                this.traverseTree(matchExpand, newNode);

                children = [];
            }
        };

        this.traverseTree(callback, this.tree);
        return this.tree;
    }

    // Traverses the tree and changes expanded property of node whose id matches provided id
    toggleNode(id, expanded) {
        const callback = (node) => {
            if (node.id === id) {
                node.expanded = expanded;
            }
        };

        this.traverseTree(callback, this.tree);
        return this.tree;
    }

    // Traverses all nodes of current component tree and applies callback to each node
    traverseTree(callback, node = this.tree) {
        if (!node) {
            return;
        }

        callback(node);

        node.children.forEach((childNode) => {
            this.traverseTree(callback, childNode);
        });
    }

    // Recursively builds the React component tree structure starting from root node
    parser(componentTree) {
        // console.log(componentTree);
        // If import is a node module, do not parse any deeper
        if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
            componentTree.thirdParty = true;
            if (
                componentTree.fileName === 'react-router-dom' ||
                componentTree.fileName === 'react-router'
            ) {
                componentTree.reactRouter = true;
            }
            return;
        }

        // Check that file has valid fileName/Path, if not found, add error to node and halt
        const fileName = this.getFileName(componentTree);
        if (!fileName) {
            componentTree.error = 'File not found.';
            return;
        }

        // If current node recursively calls itself, do not parse any deeper:
        if (componentTree.parentList.includes(componentTree.filePath)) {
            return;
        }

        // Create abstract syntax tree of current component tree file
        let ast;
        try {
            ast = babel.parse(
                fs.readFileSync(path.resolve(componentTree.filePath), 'utf-8'),
                {
                    sourceType: 'module',
                    tokens: true,
                    plugins: ['jsx', 'typescript'],
                }
            );
        } catch (err) {
            componentTree.error = 'Error while processing this file/node';
            return componentTree;
        }

        // Find imports in the current file, then find child components in the current file
        const imports = this.getImports(ast.program.body);
        const importsCallee = this.getCallee(ast.program.body);
        console.log(importsCallee);

        // Get any JSX Children of current file:
        if (ast.tokens) {
            componentTree.children = this.getJSXChildren(
                ast.tokens,
                imports,
                componentTree
            );
        }

        // Check if current node is connected to the Redux store
        if (ast.tokens) {
            componentTree.reduxConnect = this.checkForRedux(ast.tokens, imports);
        }

        // Recursively parse all child components
        componentTree.children.forEach((child) => this.parser(child));
        return componentTree;
    }

    // Finds files where import string does not include a file extension
    getFileName(componentTree) {
        const ext = path.extname(componentTree.filePath);
        let fileName = componentTree.fileName;

        if (!ext) {
            // Try and find file extension that exists in directory:
            const fileArray = fs.readdirSync(path.dirname(componentTree.filePath));
            const regEx = new RegExp(`${componentTree.fileName}.(j|t)sx?$`);
            fileName = fileArray.find((fileStr) => fileStr.match(regEx));
            fileName ? (componentTree.filePath += path.extname(fileName)) : null;
        }
        return fileName;
    }

    // Extracts Imports from current file
    // const Page1 = lazy(() => import('./page1')); -> is parsed as 'ImportDeclaration'
    // import Page2 from './page2'; -> is parsed as 'VariableDeclaration'
    // input: array of objects: ast.program.body
    // output: object of imoprts
    getImports(body) {
        const bodyImports = body.filter((item) => item.type === 'ImportDeclaration' || 'VariableDeclaration');
        console.log('body imports', bodyImports);

        return bodyImports.reduce((accum, curr) => {
            // also determine if component is client or server 
            if (curr.type === 'ImportDeclaration') {
                curr.specifiers.forEach(({ local, imported }) => {
                    accum[local.name] = {
                        importPath: curr.source.value,
                        importName: imported ? imported.name : local.name,
                    };
                });
            }
            if (curr.type === 'VariableDeclaration' && curr.declarations) {
                const importPath = this.findVarDecImports(curr.declarations[0]);
                if (importPath) {
                    const importName = curr.declarations[0].id.name;
                    accum[importName] = {
                        importPath,
                        importName
                    };
                }
            }
            return accum;
        }, {});
    }

    // helper function to determine component type (client)
    // input: ast.program.body 
    // output: boolean 

    getCallee(body) {
        const bodyCallee = body.filter((item) => item.type === 'CallExpression');
        console.log(bodyCallee);
    }

    findVarDecImports(ast) {
        // also determine if component is client or server 

        // find import path in variable declaration and return it,
        if (ast.hasOwnProperty('callee') && ast.callee.type === 'Import') {
            return ast.arguments[0].value;
        }
        // Otherwise look for imports in any other non null/undefined objects in the tree:
        for (let key in ast) {
            if (ast.hasOwnProperty(key) && typeof ast[key] === 'object' && ast[key]) {
                const importPath = this.findVarDecImports(ast[key]);
                if (importPath) {
                    return importPath;
                }
            }
        }
        return false;
    }

    // Finds JSX React Components in current file
    getJSXChildren(astTokens, importsObj, parentNode) {
        let childNodes = {};
        let props = {};
        let token;

        for (let i = 0; i < astTokens.length; i++) {
            // Case for finding JSX tags eg <App .../>
            if (
                astTokens[i].type.label === 'jsxTagStart' &&
                astTokens[i + 1].type.label === 'jsxName' &&
                importsObj[astTokens[i + 1].value]
            ) {
                token = astTokens[i + 1];
                props = this.getJSXProps(astTokens, i + 2);
                childNodes = this.getChildNodes(
                    importsObj,
                    token,
                    props,
                    parentNode,
                    childNodes
                );

                // Case for finding components passed in as props e.g. <Route component={App} />
            } else if (
                astTokens[i].type.label === 'jsxName' &&
                (astTokens[i].value === 'component' ||
                    astTokens[i].value === 'children') &&
                importsObj[astTokens[i + 3].value]
            ) {
                token = astTokens[i + 3];
                childNodes = this.getChildNodes(
                    importsObj,
                    token,
                    props,
                    parentNode,
                    childNodes
                );
            }
        }
        return Object.values(childNodes);
    }

    getChildNodes(
        imports,
        astToken,
        props,
        parent,
        children
    ) {
        if (children[astToken.value]) {
            children[astToken.value].count += 1;
            children[astToken.value].props = {
                ...children[astToken.value].props,
                ...props,
            };
        } else {
            // Add tree node to childNodes if one does not exist
            children[astToken.value] = {
                id: getNonce(),
                name: imports[astToken.value]['importName'],
                fileName: path.basename(imports[astToken.value]['importPath']),
                filePath: path.resolve(
                    path.dirname(parent.filePath),
                    imports[astToken.value]['importPath']
                ),
                importPath: imports[astToken.value]['importPath'],
                expanded: false,
                depth: parent.depth + 1,
                thirdParty: false,
                reactRouter: false,
                reduxConnect: false,
                count: 1,
                props: props,
                children: [],
                parentList: [parent.filePath].concat(parent.parentList),
                error: '',
                isClientComponent: false // for now keep it false, will change to invocation of helper func
            };
        }
        return children;
    }

    // Extracts prop names from a JSX element
    getJSXProps(astTokens, j) {
        const props = {};
        while (astTokens[j].type.label !== 'jsxTagEnd') {
            if (
                astTokens[j].type.label === 'jsxName' &&
                astTokens[j + 1].value === '='
            ) {
                props[astTokens[j].value] = true;
            }
            j += 1;
        }
        return props;
    }

    // Checks if current Node is connected to React-Redux Store
    checkForRedux(astTokens, importsObj) {
        // Check that react-redux is imported in this file (and we have a connect method or otherwise)
        let reduxImported = false;
        let connectAlias;
        Object.keys(importsObj).forEach((key) => {
            if (
                importsObj[key].importPath === 'react-redux' &&
                importsObj[key].importName === 'connect'
            ) {
                reduxImported = true;
                connectAlias = key;
            }
        });

        if (!reduxImported) {
            return false;
        }

        // Check that connect method is invoked and exported in the file
        for (let i = 0; i < astTokens.length; i += 1) {
            if (
                astTokens[i].type.label === 'export' &&
                astTokens[i + 1].type.label === 'default' &&
                astTokens[i + 2].value === connectAlias
            ) {
                return true;
            }
        }
        return false;
    }
}

// function to determine if the client component imports server components or call server hooks/utils, if it does, then return 'is not valid client comp'

// function to determine if the component is server 

module.exports = { Parser };