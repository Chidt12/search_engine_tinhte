import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import Posts from './components/posts/Posts';
import Scraping from './components/scraping/Scraping';

const App = () => {


  return (
    <>
      <div className="pt-4 pb-10">
        <Router>
          <div className="flex justify-center ">
            <div>
              <h1 className="text-xl font-medium">Tinhte.vn Search Engine</h1>
             
            </div>
          </div>
          <Switch>
            <Route path="/scraping">
              <Scraping />
            </Route>
            <Route path="/">
              <Posts />
            </Route>
          </Switch>
        </Router>
      </div>
    </>
  );
}

export default App;
