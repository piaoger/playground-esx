
'use strict';

import React from 'react';
import AppComponent from './components/app.js'



function _onReady() {
    React.render(
        <AppComponent/>, // or use React.createElement( AppComponent ),
        document.getElementById('react-app')
    );
}

// We do not need document ready for react-app is populated before loading app.js.
//
!function() {
    $(window.document).ready(_onReady);
}();
