import React from "react";
import { render } from "react-dom";
import { Switch, Route} from 'react-router-dom';


    // TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS

render(
    <div>
        <Switch >
            <Route component={App}>
            </Route>
        </Switch>
    </div>, document.getElementById('root')
);