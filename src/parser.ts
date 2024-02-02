import * as fs from 'fs';
import * as path from 'path';
import * as babel from '@babel/parser';
import { getNonce } from './utils/getNonce';
import { ImportObj } from './types/ImportObj';
import { Tree } from "./types/tree";
import { File } from '@babel/types';

export class Parser {
    entryFile: string;
    tree: Tree | undefined;

    constructor(filePath: string) {
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
    public parse(): Tree {
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
            parent: '',
            parentList: [],
            props: {},
            error: '',
            isClientComponent: false,
        };
        this.tree = root;
        this.parser(root);
        return this.tree;
    }

    public getTree(): Tree {
        return this.tree!;
    }

    // Set entryFile property with the result of Parser (from workspace state)
    public setTree(tree: Tree) {
        this.entryFile = tree.filePath;
        this.tree = tree;
    }

    public updateTree(filePath: string): Tree {
        let children: any[] = [];

        const getChildNodes = (node: Tree): void => {
            const { depth, filePath, expanded } = node;
            children.push({ depth, filePath, expanded });
        };

        const matchExpand = (node: Tree): void  => {
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

        const callback = (node: Tree): void => {
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
        return this.tree!;
    }

    // Traverses the tree and changes expanded property of node whose ID matches provided ID
    public toggleNode(id: string, expanded: boolean): Tree{
        const callback = (node: { id: string; expanded: boolean }) => {
            if (node.id === id) {
                node.expanded = expanded;
            }
        };

        this.traverseTree(callback, this.tree);
        return this.tree!;
    }

    // Traverses all nodes of current component tree and applies callback to each node
    private traverseTree(callback: Function, node: Tree | undefined = this.tree): void {
        if (!node) {
            return;
        }

        callback(node);

        node.children.forEach((childNode) => {
            this.traverseTree(callback, childNode);
        });
    }

    // Recursively builds the React component tree structure starting from root node
    private parser(componentTree: Tree): Tree | undefined {
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
            componentTree.error = 'File not found';
            return;
        }

        // If current node recursively calls itself, do not parse any deeper:
        if (componentTree.parentList.includes(componentTree.filePath)) {
            return;
        }
        // if (typeof componentTree.parentList === 'string' && componentTree.parentList.includes(componentTree.filePath)) {
        //     return;
        // }

        // Create abstract syntax tree of current component tree file
        let ast: babel.ParseResult<File>;
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

        // Set value of isClientComponent property 
        if (this.getComponentType(ast.program.directives, ast.program.body)) {
            componentTree.isClientComponent = true;
        } else {
            componentTree.isClientComponent = false;
        }

        // Get any JSX Children of current file:
        if (ast.tokens) {
            componentTree.children = this.getJSXChildren(
                ast.tokens,
                imports,
                componentTree,
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
    private getFileName(componentTree: Tree): string | undefined {
        const ext = path.extname(componentTree.filePath);
        let fileName: string | undefined = componentTree.fileName;

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
    // const App1 = lazy(() => import('./App1')); => is parsed as 'ImportDeclaration'
    // import App2 from './App2'; => is parsed as 'VariableDeclaration'
    private getImports(body: { [key: string]: any }[]): ImportObj {
        const bodyImports = body.filter((item) => item.type === 'ImportDeclaration' || 'VariableDeclaration');

        return bodyImports.reduce((accum, curr) => {
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

    private findVarDecImports(ast: { [key: string]: any }): string | boolean {
        // Find import path in variable declaration and return it,
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

    // Determines server or client component type (looks for use of 'use client' and react/redux state hooks)
    private getComponentType(directive: { [key: string]: any }[], body: { [key: string]: any }[]) {
        const defaultErr = (err) => {
            return {
                method: 'Error in getCallee method of Parser:',
                log: err,
            }
        };

        // Initial check for use of directives (ex: 'use client', 'use server', 'use strict')
        // Accounts for more than one directive 
        for (let i = 0; i < directive.length; i++) {
            if (directive[i].type === 'Directive') {
                if (typeof directive[i].value.value === 'string' && directive[i].value.value.trim() === 'use client') {
                    return true;
                }
            }    
            break;    
        }

        // Second check for use of React/Redux hooks
        // console.log('body:', body);
        // Checks for components declared using 'const'
        const bodyCallee = body.filter((item) => item.type === 'VariableDeclaration');
        // console.log('bodyCall: ', bodyCallee);
        
        // Checks for components declared using 'export default function'
        const exportCallee = body.filter((item) => item.type === 'ExportDefaultDeclaration');
        // console.log('exprt: ', exportCallee);

        // Checks for components declared using 'function'
        const functionCallee = body.filter((item) => item.type === 'FunctionDeclaration');
        // console.log('func: ', functionCallee);

        // Helper function
        const calleeHelper = (item) => {
            const hooksObj = {
                useState: 0,
                useContext: 0,
                useRef: 0,
                useImperativeHandle: 0,
                useNavigate: 0,
                useLocation: 0,
                useLayoutEffect: 0,
                useInsertionEffect: 0,
                useMemo: 0,
                useCallback: 0,
                useTransition: 0,
                useDeferredValue: 0,
                useEffect: 0,
                useReducer: 0,
                useDispatch: 0,
                useActions: 0,
                useSelector: 0,
                useShallowEqualSelector: 0,
                useStore: 0,
                bindActionCreators: 0,
            }
            if (item.type === 'VariableDeclaration') {
                try {
                    let calleeName = item.declarations[0]?.init?.callee?.name;
                    if (hooksObj.hasOwnProperty(calleeName) || (typeof calleeName === 'string' && calleeName.startsWith('use'))) {
                        return true;
                    }
                }
                catch (err) {
                    const error = defaultErr(err);
                    console.error(error.method, '\n', error.log);
                }
            }
            else if (item.type === 'ExpressionStatement') {
                try {
                    const calleeName = item.expression?.callee?.name;
                    if (calleeName === undefined) return false;
                    if (hooksObj.hasOwnProperty(calleeName) || (typeof calleeName === 'string' && calleeName.startsWith('use'))) {
                        return true;
                    }
                }
                catch (err) {
                    const error = defaultErr(err);
                    console.error(error.method, '\n', error.log);
                }
            }
            return false;
        }

        // Calling helper function for functionCallee array with length of 1 or more
        // if (functionCallee.length === 1) {
        //     const calleeArr = functionCallee[0].body?.body;
        //     if (calleeArr === undefined) return false;

        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // } else if (functionCallee.length > 1) {
        //     let calleeArr: [] = [];
        //     for (let i = 0; i < functionCallee.length; i++) {
        //         try {
        //             if (functionCallee[i].declarations[0]?.init?.body?.body) {
        //                 calleeArr = functionCallee[i].declarations[0].init.body.body;
        //             }
        //         }
        //         catch (err) {
        //             const error = defaultErr(err);
        //             console.error(error.method, '\n', error.log);
        //         }
        //     }

        //     if (calleeArr === undefined) return false;
        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // }


        // Calling helper function for exportCallee array with length of 1 or more
        // if (exportCallee.length === 1) {
        //     const calleeArr = exportCallee[0].declaration.body?.body;
        //     if (calleeArr === undefined) return false;

        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // } else if (exportCallee.length > 1) {
        //     let calleeArr: [] = [];
        //     for (let i = 0; i < exportCallee.length; i++) {
        //         try {
        //             if (exportCallee[i].declarations[0]?.init?.body?.body) {
        //                 calleeArr = exportCallee[i].declarations[0].init.body.body;
        //             }
        //         }
        //         catch (err) {
        //             const error = defaultErr(err);
        //             console.error(error.method, '\n', error.log);
        //         }
        //     }

        //     if (calleeArr === undefined) return false;
        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // }

        // console.log('hello');
        // // Calling helper function for bodyCallee array with length of 1 or more
        // if (bodyCallee.length === 1) {
        //     console.log('body in length: ', bodyCallee);
        //     const calleeArr = bodyCallee[0].declarations[0]?.init?.body?.body;            
        //     console.log('calle: ', calleeArr);
        //     if (calleeArr === undefined) return false;

        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         console.log('i:', calleeArr[i])
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // } else if (bodyCallee.length > 1) {
        //     let calleeArr: [] = [];
        //     for (let i = 0; i < bodyCallee.length; i++) {
        //         try {
        //             if (bodyCallee[i].declarations[0]?.init?.body?.body) {
        //                 calleeArr = bodyCallee[i].declarations[0].init.body.body;
        //             }
        //         }
        //         catch (err) {
        //             const error = defaultErr(err);
        //             console.error(error.method, '\n', error.log);
        //         }
        //     }

        //     if (calleeArr === undefined) return false;
        //     let checkTrue = false;
        //     for (let i = 0; i < calleeArr.length; i++) {
        //         if (checkTrue) return true;
        //         checkTrue = calleeHelper(calleeArr[i]);
        //     }
        //     return checkTrue;
        // }
        // if (!bodyCallee && !exportCallee && !functionCallee) return false;

        // Process Function Declarations
        for (const func of functionCallee) {
            const calleeArr = func.body?.body;
            if (!calleeArr) continue; // Skip if no body

            for (const callee of calleeArr) {
                if (calleeHelper(callee)) {
                    return true;
                }
            }
        }

        // Process Export Declarations
        for (const exportDecl of exportCallee) {
            const calleeArr = exportDecl.declaration.body?.body;
            if (!calleeArr) continue; // Skip if no body
    
            for (const callee of calleeArr) {
                if (calleeHelper(callee)) {
                    return true;
                }
            }
        }
    
        // Process Body Declarations
        for (const bodyDecl of bodyCallee) {
            const calleeArr = bodyDecl.declarations[0]?.init?.body?.body;
            if (!calleeArr) continue; // Skip if no body
    
            for (const callee of calleeArr) {
                if (calleeHelper(callee)) {
                    return true;
                }
            }
        }

        return false;
    }

    // Finds JSX React Components in current file
    private getJSXChildren(
        astTokens: any[],
        importsObj: ImportObj,
        parentNode: Tree
      ): Tree[] {

    let childNodes: { [key: string]: Tree } = {};
    let props: { [key: string]: boolean } = {};
    let token: { [key: string]: any };

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
                    childNodes,
                );

            // Case for finding components passed in as props e.g. <Route Component={App} />
            } else if (
                astTokens[i].type.label === 'jsxName' &&
                (astTokens[i].value === 'Component' ||
                    astTokens[i].value === 'children') &&
                importsObj[astTokens[i + 3].value]
            ) {
                token = astTokens[i + 3];
                childNodes = this.getChildNodes(
                    importsObj,
                    token,
                    props,
                    parentNode,
                    childNodes,
                );
            }
        }
        return Object.values(childNodes);
    }

    private getChildNodes(
        imports: ImportObj,
        astToken: { [key: string]: any },
        props: { [key: string]: boolean },
        parent: Tree,
        children: { [key: string]: Tree }
    ): { [key: string]: Tree } {
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
                parent: parent.id,
                parentList: [parent.filePath].concat(parent.parentList),
                error: '',
                isClientComponent: false
            };
        }
        return children;
    }

    // Extracts prop names from a JSX element
    private getJSXProps(astTokens: { [key: string]: any }[],
        j: number
      ): { [key: string]: boolean } {
        const props: any = {};
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
    private checkForRedux(astTokens: any[], importsObj: ImportObj): boolean {
        // Check that React-Redux is imported in this file (and we have a connect method or otherwise)
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
