import React from 'react';
import { connect } from 'react-redux';
import Clock from 'react-live-clock';

import logo from '../../assets/img/policeTablet/logo.png';
import map from '../../assets/img/policeTablet/map.png';
import profil from '../../assets/img/policeTablet/image_user.png';

import '../../assets/css/policeTablet.css';

class PdTablet extends React.Component { 
    constructor(props) {
        super(props);

        this.state = {
            PDPage: 'A',
            pageD: {
                step: 0,
            },
            pageB: {
                step: 0,
            },
            pageE: {
                step: 0
            },
            stars: null,
            showTablet: false,
            playerInfo: [],
            playersOnline: [],
            calls: [],
            searchPlayer: null,
            name: null,
            surname: null,
            reason: null,
            summ: null,
            playerId: null,
            data: {}
        };

        this.handleonClickBOne = this.handleonClickBOne.bind(this);
        this.handleOnClickBTwo = this.handleOnClickBTwo.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnClickD = this.handleOnClickD.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleOnClickE = this.handleOnClickE.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.removeCall = this.removeCall.bind(this);
        this.callHelp = this.callHelp.bind(this);
        this.sendSearchPlayer = this.sendSearchPlayer.bind(this);
        this.giveFine = this.giveFine.bind(this);
        this.handleOnClickED = this.handleOnClickED.bind(this);
        this.handleOnClickEB = this.handleOnClickEB.bind(this);
        this.giveWanted = this.giveWanted.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.handleClickReturnE = this.handleClickReturnE.bind(this);
        this.handleClickReturnD = this.handleClickReturnD.bind(this);
        this.handleClickReturnB = this.handleClickReturnB.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    isNumber(evt) {
        evt = (evt) || window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            evt.preventDefault();
        } else {
            return true;
        }
    }

    sendSearchPlayer(e) {
        e.preventDefault();
        if(this.state.pageE.step === 1 || this.state.pageD.step === 1 || this.state.pageB.step === 1) {
            var param = `${this.state.name} ${this.state.surname}`;
            mp.trigger('tablet.police.searchPlayer', "name", param);
        } else if(this.state.pageE.step === 2 || this.state.pageD.step === 2 || this.state.pageB.step === 2) {
            mp.trigger('tablet.police.searchPlayer', "playerId", this.state.playerId);
        }
    }

    giveFine(e) {
        e.preventDefault();
        mp.trigger('tablet.police.giveFine', this.state.searchPlayer, this.state.reason, this.state.summ);
        this.setState({ pageE: {step: 0} });
        this.setState({ searchPlayer: null });
        this.setState({ reason: null });
        this.setState({ summ: null });
        this.setState({ playerId: null });
        this.setState({ name: null });
        this.setState({ surname: null });
    }

    giveWanted(e) {
        e.preventDefault();
        mp.trigger('tablet.police.giveWanted', this.state.searchPlayer, this.state.stars);
        this.setState({ pageD: {step: 0} });
        this.setState({ searchPlayer: null });
        this.setState({ stars: null });
        this.setState({ playerId: null });
        this.setState({ name: null });
        this.setState({ surname: null });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleClickReturnE(page, step) {
        if(this.state.pageE.step === 0) {
            this.setState({ PDPage: 'A' });
        } else if(this.state.pageE.step === 2 || this.state.pageE.step === 1) {
            this.setState({ [page]: { step: 0 } });
        } else if(this.state.searchPlayer !== null && this.state.playerId === null) {
            this.setState({ [page]: { step: 1 } });
        } else if(this.state.searchPlayer !== null && this.state.name === null) {
            this.setState({ [page]: { step: 2 } });
        }
        this.setState({ searchPlayer: null });
        this.setState({ reason: null });
        this.setState({ summ: null });
        this.setState({ playerId: null });
        this.setState({ name: null });
        this.setState({ surname: null });
    }

    handleClickReturnD(page, step) {
        if(this.state.pageD.step === 0) {
            this.setState({ PDPage: 'A' });
        } else if(this.state.pageD.step === 2 || this.state.pageD.step === 1) {
            this.setState({ [page]: { step: 0 } });
        } else if(this.state.searchPlayer !== null && this.state.playerId === null) {
            this.setState({ [page]: { step: 1 } });
        } else if(this.state.searchPlayer !== null && this.state.name === null) {
            this.setState({ [page]: { step: 2 } });
        }
        this.setState({ searchPlayer: null });
        this.setState({ stars: null });
        this.setState({ playerId: null });
        this.setState({ name: null });
        this.setState({ surname: null });
    }

    handleClickReturnB(page, step) {
        if(this.state.pageB.step === 0) {
            this.setState({ PDPage: 'A' });
        } else if(this.state.pageB.step === 2 || this.state.pageB.step === 1) {
            this.setState({ [page]: { step: 0 } });
        } else if(this.state.searchPlayer !== null && this.state.playerId === null) {
            this.setState({ [page]: { step: 1 } });
        } else if(this.state.searchPlayer !== null && this.state.name === null) {
            this.setState({ [page]: { step: 2 } });
        }
        this.setState({ searchPlayer: null });
        this.setState({ stars: null });
        this.setState({ playerId: null });
        this.setState({ data: {} });
        this.setState({ name: null });
        this.setState({ surname: null });
    }

    _handleKeyDown = (event) => {
        switch(event.which) {
            case 113:
                if(window.clientStorage.faction === 2 || window.clientStorage.faction === 3) {
                    const { showTablet } = this.state;
                    if (window.medicTablet.active() || window.armyTablet.active() || window.fibTablet.active() || window.inventoryAPI.active() || window.playerMenu.active() || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) return;
                    if(showTablet === false) {
                        if (mp) mp.trigger(`toBlur`, 200);
                        mp.invoke('focus', true);
                        mp.trigger('setBlockControl', true);
                        mp.trigger("setTabletActive", true);
                        this.setState({ showTablet: true });
                    } else {
                        if (mp) mp.trigger(`fromBlur`, 200);
                        mp.invoke('focus', false);
                        mp.trigger('setBlockControl', false);
                        mp.trigger("setTabletActive", false);  
                        this.setState({ showTablet: false });
                    }
                }
                break;
            default: 
                break;
        }
    }

    componentDidMount() {
        window.pdTablet = {
            enable: (enable) => {
                document.removeEventListener("keydown", this._handleKeyDown);
                if (enable) {
                    document.addEventListener("keydown", this._handleKeyDown);
                }
            },
            active: () => {
                return this.state.showTablet;
            },
            changeOptions: (event, options) => {
                const { calls, playersOnline } = this.state;
                if(event === 'addCall') {
                    this.setState({ calls: [...calls, options] });
                } else if(event === 'addSearchPlayer') {
                    if(this.state.PDPage === 'E') {
                        this.setState({ pageE: { step: 3 } });
                        this.setState({ searchPlayer: options.playerId });
                    } else if(this.state.PDPage === 'D') {
                        this.setState({ pageD: { step: 3 } });
                        this.setState({ searchPlayer: options.playerId });
                    } else if(this.state.PDPage === 'B') {
                        this.setState({ pageB: { step: 3 } });
                        this.setState({ data: options });
                        this.setState({ searchPlayer: options.playerId });
                    }
                } else if(event === 'addTeamPlayer') {
                    this.setState({ playersOnline: [...playersOnline, options] });
                } else if(event === 'removeTeamPlayer') {
                    for (var i = 0; i < playersOnline.length; i++) {
                        if(playersOnline[i].id === options) {
                            playersOnline.splice(i, 1);
                            this.setState({ playersOnline: playersOnline });
                            break;
                        }
                    }
                } else if(event === 'removeCall') {
                    for (var i = 0; i < calls.length; i++) {
                        if(calls[i].id === options) {
                            calls.splice(i, 1);
                            this.setState({ calls: calls });
                            break;
                        }
                    }
                }
            },
        };
    }

    removeCall(id) {
        mp.trigger("tablet.police.acceptCall", id);
    }

    callHelp(event) {
        if(event === "callTeamHelp") {
            mp.trigger('tablet.police.callTeamHelp');
        } else if(event === "callHospitalHelp") {
            mp.trigger('tablet.police.callHospitalHelp');
        } else if(event === "callFibHelp") {
            mp.trigger('tablet.police.callFibHelp');
        }
    }

    handleonClickBOne() {
        const { pageB } = this.state;
        if(pageB.step === 0) {
            this.setState({ PDPage: 'A' });
        } else if(pageB.step === 1) {
            this.setState({ pageB:{step: 0} });
        } else if(pageB.step === 2) {
            this.setState({ pageB:{step: 0} });
        }
    }

    handleOnClickBTwo() {
        const { pageB } = this.state;
        if(pageB.step === 3) {
            this.setState({ pageB:{step: 0} });
        } else {
            this.setState({ PDPage: 'A', PDScan:{Information: '{}'} });
        }
    }

    handleOnClickD() {
        const { pageD } = this.state;
        if(pageD.step == 0) {
            this.setState({ PDPage: 'A' });
        } else if(pageD.step == 1) {
            this.setState({ pageB:{step: 0} });
        } else if(pageD.step == 2) {
            this.setState({ pageB:{step: 0} });
        }
    }

    handleOnClickE(step, event) {
        this.setState({ pageE:{step: step} });

        if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);
            this.setState({ PDPage: 'A' });
            this.setState({ pageE: { step: 0 } });
            this.setState({ showTablet: false });
            this.setState({ searchPlayer: null });
            this.setState({ reason: null });
            this.setState({ summ: null });
            this.setState({ playerId: null });
            this.setState({ name: null });
            this.setState({ surname: null });
        }
    }
    
    handleOnClickED(step, event) {
        this.setState({ pageD:{step: step} });

        if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);
            this.setState({ PDPage: 'A' });
            this.setState({ pageD: { step: 0 } });
            this.setState({ showTablet: false });
            this.setState({ searchPlayer: null });
            this.setState({ stars: null });
            this.setState({ playerId: null });
            this.setState({ name: null });
            this.setState({ surname: null });
        }
    }

    handleOnClickEB(step, event) {
        this.setState({ pageB:{step: step} });

        if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);
            this.setState({ PDPage: 'A' });
            this.setState({ pageB: { step: 0 } });
            this.setState({ showTablet: false });
            this.setState({ searchPlayer: null });
            this.setState({ stars: null });
            this.setState({ data: {} });
            this.setState({ playerId: null });
            this.setState({ name: null });
            this.setState({ data: {} });
            this.setState({ surname: null });
        }
    }

    handleOnClick(page, event, value) {
        if(page === 'D' && event === 'step') {
            this.setState({ pageD:{step: value} });
        } else if(event === 'page') {
            this.setState({ PDPage: page });
        } else if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);
            this.setState({ PDPage: 'A' });
            this.setState({ showTablet: false });
        }
    }

    render() {
        const { PDPage, pageD, pageB, PDScan, playersOnline, showTablet, pageE } = this.state;
        return (
            <div id="pd-tablet">
                <div className="tablet-background" style={{position: 'absolute', zIndex: '4', display: showTablet === true ? 'block' : 'none'}}>
                    <div className="imurfather">
                        <div className="header">
                            <div className="FIB newyorksixty">Los Santos Police Department</div>
                            <div className="subtext londonsixty">Единая государственная база данных</div>
                            <hr/>
                            <img src={logo}/>
                            <div className="time londonsixty"><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Moscow'} /></div>
                        </div>
                        {PDPage === 'A' ?
                        <div>
                            <div className="pageA">
                                <div className="buttons">
                                    <button onClick={() => this.handleOnClick('G', 'page')}>Список вызовов</button>
                                    <button onClick={() => this.handleOnClick('B', 'page')}>Поиск гражданина</button>
                                    <button onClick={() => this.handleOnClick('C', 'page')}>Список сотрудников</button>
                                    <button onClick={() => this.handleOnClick('D', 'page')}>Объявить в розыск</button>
                                    <button onClick={() => this.handleOnClick('E', 'page')}>Вписать штраф</button>
                                    <button onClick={() => this.handleOnClick('F', 'page')}>Запросить помощь</button>
                                </div>
                                <div className="text">
                                    Используйте базу данных Los Santos Police Department, чтобы найти преступников среди
                                    невинных людей. Сделайте этот город безопастным для общества!
                                </div>
                                <div className="buttons_nav">
                                    <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right', top: '12.5em'}}>Exit</button>
                                </div>
                            </div>
                        </div> : ''}
                        {PDPage === 'B' ?
                        <div>
                            <div className="pageB">
                                <div className="header">Поиск гражданина</div>
                                {pageB.step === 0 && this.state.searchPlayer === null ?
                                <div className="step0">
                                    <div className="buttons">
                                        <button onClick={() => this.handleOnClickEB(1)}>По Личным Данным</button>
                                        <button onClick={() => this.handleOnClickEB(2)} style={{marginTop: '8px'}}>По ID Ориентировке</button>
                                    </div>
                                </div> : ''}
                                {pageB.step === 1 && this.state.searchPlayer === null ?
                                <div className="step1">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите данные</div>
                                        <div className="textInput" style={{marginBottom: '16px', marginLeft: '-9%'}}>Имя: <input name="name" id="name" value={this.state.name} onChange={this.onChange}/></div>
                                        <div className="textInput" style={{marginLeft: '-18%'}}>Фамилия: <input name="surname" id="surname" value={this.state.surname} onChange={this.onChange}/></div>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Поиск</button>
                                        </div>
                                    </div>
                                </div> : ''}
                                {pageB.step === 2 && this.state.searchPlayer === null ?
                                <div className="step2">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите ID</div>
                                        <div className="help">Используйте технологию <div style={{display: 'contents'}}>ID</div>
                                            ориентировки. Это новая функция для LSPD & FIB. С помощью неё вы сможете узнать
                                            частично информацию о любом жильце в штате.</div>
                                        <div className="ID">
                                            <div style={{display: 'contents'}}>ID</div> ориентировка:
                                        </div>
                                        <input maxLength="3" name="playerId" id="playerId" value={this.state.playerId} onChange={this.onChange} onKeyPress={this.isNumber}/>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Поиск</button>
                                        </div>
                                    </div>
                                </div> : ''}
                                {pageB.step === 3 && this.state.searchPlayer !== null ?
                                <div className="else">
                                    <img src={profil}/>
                                    <div className="info">
                                        <div className="header">Имя Фамилия</div> {this.state.data.name}
                                        <div className="header">место ПРОЖИВАНИЯ {this.state.data.houses.length !== 0 ? 
                                            this.state.data.houses.map(house => (
                                                <div style={{fontSize: '2vh', color: 'white'}}>{house.adress} [Дом №{house.id}]</div>
                                                )) : <div style={{fontSize: '2vh', color: 'white'}}>Бездомный</div>}
                                        </div> 
                                        <div className="header">место РАБОТЫ</div> {this.state.data.faction}
                                        <div className="header">Преступлений</div> Всего: {this.state.data.crimes}
                                    </div>
                                </div> : ''}
                                <div className="buttons_nav">
                                <button onClick={() => this.handleClickReturnB('pageB', pageB.step)} className="back focus" style={{float: 'left'}}>BACK</button>
                                    <button className="exitbutton focus" onClick={() => this.handleOnClickEB('', 'exit')} style={{float: 'right'}}>Exit</button>
                                </div>
                            </div>
                        </div> : ''}
                        {PDPage === 'C' ?
                        <div>
                            <div className="pageC">
                                {playersOnline.length !== 0 ?
                                <div style={{height: '58%', top: '2em', position: 'relative', overflow: 'auto'}}>
                                    <table style={{width: '85%', borderCollapse: 'collapse'}}>
                                        <tr className="header">
                                            <th>Имя Фамилия</th>
                                            <th>Должность</th>
                                        </tr>
                                        {playersOnline.map(item => (
                                        <tr className="users">
                                            <td>{item.name}</td>
                                            <td>{item.rank}</td>
                                        </tr>
                                        ))}
                                    </table>
                                </div> : ''}
                                {playersOnline.length === 0 ?
                                <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>
                                    Список пуст.
                                </div> : ''}

                                <div className="buttons_nav">
                                    <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>BACK</button>
                                    <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Exit</button>
                                </div>
                            </div>
                        </div> : ''}
                        {PDPage === 'D' ?
                        <div>
                            <div className="pageD">
                                {pageD.step === 0 && this.state.searchPlayer === null ?
                                <div className="step0">
                                    <div className="buttons">
                                        <button onClick={() => this.handleOnClickED(1)}>По Личным Данным</button>
                                        <button onClick={() => this.handleOnClickED(2)} style={{marginTop: '8px'}}>По ID Ориентировке</button>
                                    </div>
                                    <div className="footer">
                                        Офицеры и сержанты! Будьте внимательнее при объявлении в розыск человека/преступника.
                                        Введя не верные или ложные данные, может пострадать невинный гражданин штата San
                                        Andreas.
                                    </div>
                                </div> : ''}
                                {pageD.step === 1 && this.state.searchPlayer === null ?
                                <div className="step1">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите данные</div>
                                        <div className="textInput" style={{marginBottom: '16px', marginLeft: '-9%'}}>Имя: <input name="name" id="name" value={this.state.name} onChange={this.onChange}/></div>
                                        <div className="textInput" style={{marginLeft: '-18%'}}>Фамилия: <input name="surname" id="surname" value={this.state.surname} onChange={this.onChange}/></div>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Сканировать</button>
                                        </div>
                                    </div>
                                </div> : ''}
                                {pageD.step === 2 && this.state.searchPlayer === null ?
                                <div className="step2">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите ID</div>
                                        <div className="help">Используйте технологию <div style={{display: 'contents'}}>ID</div>
                                            ориентировки. Это новая функция для LSPD & FIB. С помощью неё вы сможете узнать
                                            частично информацию о любом жильце в штате.</div>
                                        <div className="ID">
                                            <div style={{display: 'contents'}}>ID</div> ориентировка:
                                        </div>
                                        <input maxlength="3" id="playerId" name="playerId" value={this.state.playerId} onChange={this.onChange} onKeyPress={this.isNumber}/>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Сканировать</button>
                                        </div>
                                    </div>
                                </div> : ''}

                                {pageD.step === 3 && this.state.searchPlayer !== null ?
                                <div className="step1">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите данные</div>
                                        <div className="textInput" style={{marginBottom: '16px', marginLeft: '-9%'}}>Звезд: <input maxlength="1" name="stars" id="stars" value={this.state.stars} onKeyPress={this.isNumber} onChange={this.onChange}/></div>
                                        <div className="smallButtons">
                                            <button onClick={this.giveWanted}>Объявить в розыск</button>
                                        </div>
                                    </div>
                                </div> : ''}

                                <div className="buttons_nav">
                                    <button onClick={() => this.handleClickReturnD('pageD', pageD.step)} className="back focus" style={{float: 'left'}}>BACK</button>
                                    <button className="exitbutton focus" onClick={() => this.handleOnClickED('', 'exit')} style={{float: 'right'}}>Exit</button>
                                </div>
                            </div>
                        </div> : ''}
                        {PDPage === 'E' ?
                        <div>
                            <div className="pageD">
                                {pageE.step === 0 && this.state.searchPlayer === null ?
                                <div className="step0">
                                    <div className="buttons">
                                        <button onClick={() => this.handleOnClickE(1)}>По Личным Данным</button>
                                        <button onClick={() => this.handleOnClickE(2)} style={{marginTop: '8px'}}>По ID Ориентировке</button>
                                    </div>
                                    <div className="footer">
                                        Офицеры и сержанты! Будьте внимательнее при выписки штрафа на человека.
                                        Введя не верные или ложные данные, может пострадать невинный гражданин штата San
                                        Andreas.
                                    </div>
                                </div> : ''}
                                {pageE.step === 1 && this.state.searchPlayer === null ?
                                <div className="step1">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите данные</div>
                                        <div className="textInput" style={{marginBottom: '16px', marginLeft: '-9%'}}>Имя: <input name="name" id="name" value={this.state.name} onChange={this.onChange}/></div>
                                        <div className="textInput" style={{marginLeft: '-18%'}}>Фамилия: <input name="surname" id="surname" value={this.state.surname} onChange={this.onChange}/></div>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Сканировать</button>
                                        </div>
                                    </div>
                                </div> : ''}
                                {pageE.step === 2 && this.state.searchPlayer === null ?
                                <div className="step2">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите ID</div>
                                        <div className="help">Используйте технологию <div style={{display: 'contents'}}>ID</div>
                                            ориентировки. Это новая функция для LSPD & FIB. С помощью неё вы сможете узнать
                                            частично информацию о любом жильце в штате.</div>
                                        <div className="ID">
                                            <div style={{display: 'contents'}}>ID</div> ориентировка:
                                        </div>
                                        <input maxlength="3" id="playerId" name="playerId" value={this.state.playerId} onChange={this.onChange} onKeyPress={this.isNumber}/>
                                        <div className="smallButtons">
                                            <button onClick={this.sendSearchPlayer}>Сканировать</button>
                                        </div>
                                    </div>
                                </div> : ''}

                                {pageE.step === 3 && this.state.searchPlayer !== null ?
                                <div className="step1">
                                    <div className="findUser">
                                        <div className="title" style={{marginTop: '25px'}}>Введите данные</div>
                                        <div className="textInput" style={{marginBottom: '16px', marginLeft: '-9%'}}>Причина: <input maxlength="16" name="reason" id="reason" value={this.state.reason} onChange={this.onChange}/></div>
                                        <div className="textInput" style={{marginLeft: '-5%'}}>Сумма: <input maxlength="8" name="summ" id="summ" value={this.state.summ} onChange={this.onChange} onKeyPress={this.isNumber}/></div>
                                        <div className="smallButtons">
                                            <button onClick={this.giveFine}>Выписать штраф</button>
                                        </div>
                                    </div>
                                </div> : ''}

                                <div className="buttons_nav">
                                    <button onClick={() => this.handleClickReturnE('pageE', pageE.step)} className="back focus" style={{float: 'left'}}>BACK</button>
                                    <button className="exitbutton focus" onClick={() => this.handleOnClickE('', 'exit')} style={{float: 'right'}}>Exit</button>
                                </div>
                            </div>
                        </div> : ''}
                        {PDPage === 'F' ?
                        <div>
                            <div class="pageF">
                                <div class="header">Запросить Помощь По экстренной связи</div>
                                <div class="buttons">
                                    <button onClick={() => this.callHelp('callFibHelp')}>БЛИЖАЙШИЙ ЭКИПАЖ FIB</button>
                                    <button onClick={() => this.callHelp('callTeamHelp')}>НАРЯД ПОЛИЦЕЙСКИХ</button>
                                    <button onClick={() => this.callHelp('callHospitalHelp')}>MEDIC OUTFIT</button>
                                </div>
                                <div class="beDown">
                                    Использование экстренной связи, даст возможность мгновенно выслать координаты вашего места
                                    нахождения ближайшему патрульному экипажу с сигналом “OBSOS”
                                </div>
                                <div class="buttons_nav">
                                    <button class="back focus" onClick={() => this.handleOnClickD('A', 'page')} style={{float: 'left'}}>BACK</button>
                                    <button class="exitbutton focus" onClick={() => this.handleOnClickD('', 'exit')} style={{float: 'right'}}>Exit</button>
                                </div>
                            </div>
                        </div>  : ''}
                        {PDPage === 'G' ?
                        <div>
                            <div class="pageG">
                                <div class="calls">
                                    <div class="calls_overflow">
                                        {this.state.calls.length !== 0 ?
                                        <div>
                                            {this.state.calls.map(item =>
                                            <div class="call">
                                                <div class="color">Call from:</div> 
                                                {item.name}
                                                <div class="color">Distance:</div> 
                                                TO DO
                                                <div class="color">Message:</div> 
                                                {item.message}
                                                <button onClick={() => this.removeCall(item.id)} class="getcall">Accept call</button>
                                            </div> 
                                            )}
                                        </div> : 
                                        <div>
                                            <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>Список пуст.</div>
                                        </div>}
                                    </div>
                                </div>
                                <div class="map">
                                    <img src={map}/>
                                </div>
                                <div class="buttons_nav">
                                    <button class="exitbutton focus" onClick={() => this.handleOnClickD('A', 'page')} style={{float: 'right'}}>BACK</button>
                                </div>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
};

const connectedLoginPage = connect(mapStateToProps)(PdTablet);
export { connectedLoginPage as PdTablet }; 