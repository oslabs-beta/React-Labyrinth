import { Tree } from "./tree"


export interface hierarchyData {
    children?: hierarchyData[],
    data: Tree,
    depth: number,
    height: number,
    parent: hierarchyData | null
}