import React from 'react';
import { connect } from 'react-redux';
import Clock from 'react-live-clock';

import logo from '../../assets/img/medicTablet/logo.png';
import map from '../../assets/img/medicTablet/map.png';
import profil from '../../assets/img/medicTablet/profil.png';

import '../../assets/css/medicalTablet.css';

class MedicTablet extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            LSMCPage: 'A',
            playerInfo: [],
            playersOnline: [],
            showTablet: false,
            calls: [],
            advert: ''
        }; 

        this.handleOnClick = this.handleOnClick.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.sendAdvert = this.sendAdvert.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeCall = this.removeCall.bind(this);
        this.callHelp = this.callHelp.bind(this);
    }

    handleOnClick(page, event) {
        if(event === 'page') {
            this.setState({ LSMCPage: page });
        } else if(event === 'exit') {
            if (mp) mp.trigger(`fromBlur`, 200);
            mp.invoke('focus', false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setTabletActive", false);    
            this.setState({ showTablet: false });
        }
    }
 
    _handleKeyDown = (event) => {
        switch(event.which) {
            case 113:
                if(window.clientStorage.faction === 5) {
                    const { showTablet } = this.state;
                    if (window.armyTablet.active() || window.fibTablet.active() || window.pdTablet.active() || window.inventoryAPI.active() || window.playerMenu.active() || window.consoleAPI.active() || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) return;
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

    sendAdvert(e) {
        e.preventDefault();
        const { advert } = this.state;
        if(advert.length !== 0 && advert.length < 150) {
            mp.trigger('tablet.medic.sendAdvert', advert);
            this.setState({ advert: '' });
            this.setState({ LSMCPage: 'A' });
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    removeCall(id, x, y) {
        mp.trigger("tablet.medic.acceptCall", id, x, y);
    }

    callHelp(event) {
        if(event === "callTeamHelp") {
            mp.trigger('tablet.medic.callTeamHelp');
        } else if(event === "callPoliceHelp") {
            mp.trigger('tablet.medic.callPoliceHelp');
        }
    }

    componentDidMount() { 
        window.medicTablet = {
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

    render() {
        const { showTablet } = this.state;
        return (
            <div id="medic-tablet">
                <div className="tablet-background" style={{position: 'absolute', zIndex: '99', display: showTablet === true ? 'block' : 'none'}}>
                    <div className="imurfather">
                        <div className="header">
                            <div className="LSMC newyorksixty">Los Santos Medical Center</div>
                            <div className="subtext londonsixty">Единая государственная база данных</div>
                            <hr/>
                            <img src={logo} style={{width: '90px', height: '90px'}}/>
                            <div className="time londonsixty"><Clock format={'HH:mm'} ticking={true} timezone={'Europe/Moscow'} /></div>
                        </div>
                        {this.state.LSMCPage === 'A' ?
                        <div>
                            <div className="body">
                                <div className="buttons">
                                    <button onClick={() => this.handleOnClick('B', 'page')}>Список вызовов</button>
                                    <button onClick={() => this.handleOnClick('C', 'page')}>Сотрудники в сети</button>
                                    <button onClick={() => this.handleOnClick('D', 'page')}>Моя карточка</button>
                                    <button onClick={() => this.handleOnClick('E', 'page')}>Запросить помощь</button>
                                    <button onClick={() => this.handleOnClick('F', 'page')}>Новость штата</button>
                                </div>
                                <div className="text">
                                    Используйте базу данных Los Santos Medical Center чтобы взять вызов и спасти жизнь
                                    гражданину штата.
                                </div>
                                <div className="buttons_nav">
                                    <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right', top: '12.5em'}}>Exit</button>
                                </div>
                            </div>
                        </div> : null}
                        {this.state.LSMCPage === 'B' ?
                        <div>
                            <div className="calls">
                                <div className="calls_overflow">
                                {this.state.calls.length !== 0 ?
                                    <div>
                                        {this.state.calls.map(item =>
                                        <div className="call">
                                            <div className="color">Call from:</div>
                                            {item.name}
                                            <div className="color">Distance:</div>
                                            {parseInt(item.dist)} метров
                                            <div className="color">Message:</div>
                                            {item.message}
                                            <button onClick={() => this.removeCall(item.id, item.pos.x, item.pos.y)} className="getcall">Accept call</button>
                                            </div>
                                        )}
                                    </div> :
                                    <div>
                                        <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>Список пуст.</div>
                                    </div>}
                                </div>
                            </div>
                            <div className="map">
                                <img src={map} style={{width: '520px', height: '334px'}}/>
                                <div className="buttons_nav">
                                    <button onClick={() => this.handleOnClick('A', 'page')} className="exitbutton focus">BACK</button>
                                </div>
                            </div>
                        </div> : null}
                        {this.state.LSMCPage === 'C' ?
                        <div>
                            <div className="C">
                                {this.state.playersOnline.length !== 0 ?
                                <div>
                                    <table style={{width: '85%', borderCollapse: 'collapse'}}>
                                        <tr className="header">
                                            <th>Имя Фамилия</th>
                                            <th>Должность</th>
                                        </tr>
                                        {this.state.playersOnline.map((item, i) => (
                                            <tr key={i} className="users">
                                                <td>{item.name}</td>
                                                <td>{item.rank}</td>
                                        </tr>))}
                                    </table>
                                </div> : null}
                            </div>
                            {this.state.playersOnline.length === 0 ?
                            <div>
                                <div className="londonsixty" style={{color: 'white', fontSize: '18px', textAlign: 'center'}}>Список пуст.</div>
                            </div> : null}
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>BACK</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Exit</button>
                            </div>
                        </div> : null}
                        {this.state.LSMCPage === 'D' ?
                        <div>
                            <div className="info">
                                <div className="nameHeader">Имя Фамилия</div>
                                <div className="name">{window.clientStorage.name}</div>
                                <div className="postHeader">Должность</div>
                                <div className="post">{window.clientStorage.factionRankName}</div>
                            </div>
                            <div className="image">
                                <img src={profil} style={{width: '140px', height: '140px'}}/>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>BACK</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Exit</button>
                            </div>
                        </div> : null}
                        {this.state.LSMCPage === 'E' ?
                        <div>
                            <div className="body">
                                <div className="header">Запросить помощь по экстренной связи</div>
                                <div className="buttonsE">
                                    <button className="back focus" onClick={() => this.callHelp('callTeamHelp')} style={{float: 'left'}}>Ближайший экипаж</button>
                                    <button className="exitbutton focus" onClick={() => this.callHelp('callPoliceHelp')} style={{float: 'right'}}>Полиция</button>
                                </div>
                                <div className="texthelp">Использование экстренной связи, даст возможность мгновенно выслать
                                    координаты вашего места нахождения ближайшему патрульному экипажу с сигналом “OBSOS”
                                </div>
                            </div>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>BACK</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Exit</button>
                            </div>
                        </div> : null}
                        {this.state.LSMCPage === 'F' ?
                        <div className="">
                            <form className="news" onSubmit={this.onSubmit}>
                                <div className="header">ГОСУДАРСТВЕННОЕ ОБЪЯВЛЕНИЕ</div>
                                <div className="input">
                                    <textarea id="advert" name="advert" maxLength="150" value={this.state.advert} onChange={this.onChange}></textarea>
                                </div>
                                <button className="buttonGoodWay" onClick={this.sendAdvert}>Подать ОБЪЯВЛЕНИЕ</button>
                            </form>
                            <div className="buttons_nav">
                                <button className="back focus" onClick={() => this.handleOnClick('A', 'page')} style={{float: 'left'}}>BACK</button>
                                <button className="exitbutton focus" onClick={() => this.handleOnClick('', 'exit')} style={{float: 'right'}}>Exit</button>
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

const connected = connect(mapStateToProps)(MedicTablet);
export { connected as MedicTablet }; 