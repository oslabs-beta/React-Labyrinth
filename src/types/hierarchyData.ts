import { Tree } from "./tree"

export interface hierarchyData {
    id: string,
    position: { x: number, y: number },
    type: string,
    data: { label: string },
    style: {
      borderRadius: string,
      borderWidth: string,
      borderColor: string,
      display: string,
      justifyContent: string,
      placeItems: string,
      backgroundColor: string,
    }
};