import React from 'react';
// will create a build func and then call the helper funcs to return an object
// make a new instance of this class in flow, call the build method, and pass this as state

interface Node {
  id: string;
  data: {
    label: React.ReactNode;
  };
  type: string;
  position: { x: number, y: number};
  style: {
    borderRadius: string;
    borderWidth: string;
    borderColor: string;
    display: string;
    justifyContent: string;
    placeItems: string;
    backgroundColor: string; 
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}

interface ParsedDataItem {
  fileName: string;
  isClientComponent: boolean;
  children?: ParsedDataItem[];
  thirdParty?: boolean;
  reactRouter?: boolean;
}

interface Settings {
  thirdParty: boolean;
  reactRouter: boolean;
}

class FlowBuilder {
  private parsedData: ParsedDataItem[];
  private id: number;
  private x: number;
  private y: number;
  public initialNodes: Node[];
  private viewData: ParsedDataItem[];
  private edgeId: number;
  public initialEdges: Edge[];

  constructor(data: ParsedDataItem) {
    this.parsedData = [data];
    this.id = 0;
    this.x = 0;
    this.y = 0;
    this.initialNodes = [];
    this.viewData = [];
    this.edgeId = 0;
    this.initialEdges = [];
  }

  private buildNodesArray(parsedData: ParsedDataItem[] | undefined, x: number = this.x, y: number = this.y): void {
    if (!parsedData) return;

    parsedData.forEach((item) => {
      const node: Node = {
        id: (++this.id).toString(),
        data: {
          label: (
            <div className="text-sm font-medium text-ellipsis overflow-hidden ..." key={this.id}>{item.fileName}</div>
          )
        },
        // type: item.depth === 0 ? 'input' : '',
        type: 'default',
        position: { x: (x += 40), y: (y += 30) },
        style: {
          borderRadius: '6px',
          borderWidth: '2px',
          borderColor: '#6b7280',
          display: 'flex',
          justifyContent: 'center',
          placeItems: 'center',
          backgroundColor: `${(item.isClientComponent) ? '#fdba74' : '#93C5FD'}`,
        },
      };
      this.initialNodes.push(node);
      if (item.children) {
        this.buildNodesArray(item.children, (this.x += 40), (this.y += 30));
      }
    });
  };

  private buildEdgesArray(parsedData: ParsedDataItem[] | undefined, parentID?: number): void {
    if (!parsedData) return;

    parsedData.forEach((item) => {
      const nodeID = ++this.edgeId;
      if (parentID) {
        const edge: Edge = {
          id: `e${parentID}-${nodeID}`,
          source: parentID.toString(),
          target: nodeID.toString(),
          type: 'bezier',
          animated: false,
        };
        this.initialEdges.push(edge);
      }
      if (item.children) {
        this.buildEdgesArray(item.children, nodeID);
      }
    });
  }

  public build(settings: Settings): void {
    const treeParsed = JSON.parse(JSON.stringify(this.parsedData[0]));
    console.log('settings: ', settings);
    const traverse = (node: ParsedDataItem): void => {
      let validChildren: ParsedDataItem[] = [];

      for (let i = 0; i < node.children?.length; i++) {
        if (
          node.children[i].thirdParty &&
          settings.thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        } else if (node.children[i].reactRouter && settings.reactRouter) {
          validChildren.push(node.children[i]);
        } else if (
          !node.children[i].thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        }
      }

      // Update children with only valid nodes, and recurse through each node
      node.children = validChildren;
      node.children.forEach((child) => {
        traverse(child);
      });
    }
    traverse(treeParsed);
    // Update the viewData state
    this.viewData = ([treeParsed]);
    console.log('viewData:', this.viewData);
    this.buildNodesArray(this.viewData);
    this.buildEdgesArray(this.viewData);
  }
}

export default FlowBuilder;