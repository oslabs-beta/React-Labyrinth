const vscode = require('vscode');
const fs = require('fs')
const path = require('path')
const babel = require('@babel/parser');
const getNonce = require('./getNonce.js');
const Tree = require('./treeTemplates/tree.js')

class Parser {
    constructor() {
        this.ast = undefined;
        this.entryFile = undefined;
        this.arrList = [];
    }

    async grabFile(file) {
        try {
            // const file = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: true, canSelectMany: true });
            if (typeof (file) !== 'string') {
                file = path.resolve(file[0].path)
            }
            this.ast = babel.parse(
                fs.readFileSync(file, 'utf-8'),
                {
                    sourceType: 'module',
                    tokens: true,
                    plugins: ['jsx', 'typescript'],
                });
            await this.traverseAST(this.ast);

            console.log('Result of arrList: ', this.arrList);

        } catch (error) {
            console.error(`Error processing file: ${error}`)
        }
    }


    // traverse the ast nodes, passing in node
    traverseAST(node) {
        if (node.type === 'ImportDeclaration') {
            // extract file name path 
            const elementName = node.source.value;
            if (elementName.startsWith('./') || elementName.startsWith('../')) {
                console.log('file path:', elementName)
                // processedNodes.add(elementName)
                console.log('node import: ', node);
                this.arrList.push(node.source.value);
                return this.grabFile(node.source.value);
            };

            /* this code only works for JSXElement types: has prop of .children, but not the one above
            if (node.children) {
                // if node children exist, then recursively call the child nodes with this func
                for (const child of node.children) {
                    await traverseAST(child);
                }
            }
            */
        } else {
            // const isClientComp = await checkForClientString(node);
            // const isReactHook = await checkReactHooks(node);

            // recursively iterate through the other non-jsx types if the jsx node children doesnt exist 
            for (const key in node) {
                if (node[key] && typeof node[key] === 'object' && key !== 'tokens') {
                    this.traverseAST(node[key]);
                }
            }
        }
    }

    // function to determine server or client component (can look for 'use client' and 'hooks')
    checkForClientString(node) {
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

    checkReactHooks(node) {
        // for just the mvp, look up for the FIRST client component and make every child as a client component

        // function to determine if component uses react hooks (this only checks if its BEING CALLED IN COMPONENT)
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
}

// function to determine if the client component imports server components or call server hooks/utils, if it does, then return 'is not valid client comp'

// function to determine if the component is server 

// render component tree using react flow, passing in node and recursvely call on child nodes

module.exports = { Parser };