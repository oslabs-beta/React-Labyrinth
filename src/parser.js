const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');

let ast;
async function grabFile() {
    try {
        const file = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: true, canSelectMany: true });
        console.log('file path', file[0].path);
        const name = path.basename(file[0].path);
        console.log('name of file', name);
        ast = await babel.parse(
            fs.readFileSync(path.resolve(file[0].path), 'utf-8'),
            {
                sourceType: 'module',
                tokens: true,
                plugins: ['jsx', 'typescript'],
            });
        // console.log('ast', ast);
        const result = await traverseAST(ast);
        console.log('res', result);
        // const tokens = ast.tokens;
        // console.log('tokens are:', tokens);
    } catch (error) {
        console.error(`Error processing file: ${error}`)
    }
}

// create a set to reduce redundancy in console logs during recursive call
const processedNodes = new Set();

// traverse the ast nodes, passing in node
async function traverseAST(node) {
    // identify which are jsx elements type and then extract info about them (like the component name) and store it in var
    if (node.type === 'ImportDeclaration' && !processedNodes.has(node)) {
        processedNodes.add(node);
        // console.log('JSX Node', node);

        // im guessing that jsx elements will never contain the use client or hook declaration, so i wouldnt need to call the functions here

        // property on node to obtain component name (could be tag or component name)
        const elementName = node.source.value;
        if(elementName.startsWith('./') || elementName.startsWith('../'))  console.log('file path:', elementName);
       

        if (node.children) {
            // if node children exist, then recursively call the child nodes with this func
            for (const child of node.children) {
                await traverseAST(child);
            }
        }
    } else if (!processedNodes.has(node)) {
        processedNodes.add(node);

        // call the function to determine if it is a client component and store it in var
        // const isClientComp = await checkForClientString(node);
        // const isReactHook = await checkReactHooks(node);

        // recursively iterate through the other non-jsx types if the jsx node children doesnt exist 
        for (const key in node) {
            if (node[key] && typeof node[key] === 'object' && key !== 'tokens') {
                await traverseAST(node[key]);
            }
        }
    }
    return processedNodes;
}

// function to determine server or client component (can look for 'use client' and 'hooks')

// also might want to consider functionality for child components of the current node to be classifed as client component (except for server clients rendered tree)

function checkForClientString(node) {
    if (node.type === 'Directive') {
        console.log('node', node);

        // access the value property of the Directive node
        console.log('Directive Value:', node.value);

        // check if the node.value is a 'DirectiveLiteral' node
        if (node.value && node.value.type === 'DirectiveLiteral') {

            // check the value to see if it is 'use client'
            if (typeof node.value.value === 'string' && node.value.value.trim() === 'use client') {
                // access the value property of the 'DirectiveLiteral' node
                console.log('DirectiveLiteral Value:', node.value.value);

                // might need to do something else here to make it known as client type
                console.log(`this node above has 'use client': `, true);
                return true;
            }
        }
    }
    return false;
}

function checkReactHooks(node) {
    // for just the mvp, look up for the FIRST client component and make every child as a client component

    // function to determine if component uses react hooks (this only checks if its BEING CALLED IN COMPONENT, not IMPORTED)
    // console.log('node', node);
    if (node.type === 'CallExpression') {
        console.log('nodeCall', node)
        if (node.callee && node.callee.name) {
            if (node.callee.name.startsWith('use')) {
                // if the node.type is CallExpression (dealing with function or method call) (callee is prop on callexpression - an identifier), return true
                console.log('node.callee', node.callee);
                console.log('Node with Hook', node.callee.name);
                console.log(`this node above uses hooks: `, true);
                return true;
            }
        }
    }

    // function to determine if hooks are being IMPORTED
    // if (node.type === 'ImportDeclaration') {
    //     console.log('node import', node);
    //     if (node.specifiers) {
    //         // filter through the array to see which ones uses hooks
    //         const clientNodes = node.specifiers.filter((nodeImport) => {
    //             return nodeImport.type === 'ImportSpecifier' && nodeImport.imported.name.startsWith('use');
    //         });
    //         // mapped over to console log the name of hook 
    //         clientNodes.map((nodeImport) => console.log('Names of Hooks', nodeImport.imported.name));
    //         console.log(clientNodes);
    //         // we'll wanna change this to use it somehow 
    //         return clientNodes;
    //     }
    return false;
}

// function to determine if the client component imports server components or call server hooks/utils, if it does, then return 'is not valid client comp'

// function to determine if the component is server 

// render component tree using react flow, passing in node and recursvely call on child nodes

module.exports = { grabFile };