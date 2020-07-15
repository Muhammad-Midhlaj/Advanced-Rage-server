import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../helpers/history';

import { MedicTablet } from '../pages/tablets/MedicTablet';
import { FibTablet } from '../pages/tablets/FibTablet';
import { ArmyTablet } from '../pages/tablets/ArmyTablet';
import { PdTablet } from '../pages/tablets/PdTablet';
import { PlayerMenu } from '../pages/PlayerMenu';
import { BuyCar } from '../pages//autoSaloon/BuyCar';
import { MedicCerf } from '../pages/cerfs/MedicCerf';
import { SpeedoMeter } from '../pages/carSystem/SpeedoMeter';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
 
    render() {
        return (
            <Router history={history}> 
                <React.Fragment>
                    <MedicTablet />
                    <ArmyTablet />
                    <PdTablet />
                    <FibTablet />
                    <PlayerMenu />
                    <MedicCerf />
                    <SpeedoMeter/>
                    <BuyCar/>
                </React.Fragment>
            </Router>
        );
    }
}

       
function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}


const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 