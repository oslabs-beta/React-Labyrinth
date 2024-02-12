import { lazy } from "react";
const Component1 = lazy(() => import('./Component1'));
import Component2 from "./Component2";
import Component3 from "./Component3";

export default function Pages() {
    return (
        <div>
            <Component1 />
            <Component2 />
            <Component3 />
        </div>
    );
}