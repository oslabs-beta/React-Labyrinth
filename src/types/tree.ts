export type Tree = {
    id: string;
    name: string;
    fileName: string;
    filePath: string;
    importPath: string;
    expanded: boolean;
    depth: number;
    count: number;
    thirdParty: boolean;
    reactRouter: boolean;
    reduxConnect: boolean;
    children: Tree[];
    parent: string;
    parentList: string[];
    props: { [key: string]: boolean; };
    error: string;
    isClientComponent: boolean;
}
