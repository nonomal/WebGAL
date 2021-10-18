// -------- 导入导出存档 --------
class ImporterExporter extends React.Component {
    constructor() {
        super();
        this.dummyA = null;
        this.dummyInput = null;
    }


    componentDidMount() {
        this.dummyA = document.querySelector('a#dummy-saves-exporter');
        this.dummyInput = document.querySelector('input#dummy-saves-importer');
    }


    importSaves(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = (evR) => {
            const saves = evR.target.result;
            localStorage.setItem('WebGAL', saves);
            loadCookie();
            window.location.reload();  // dirty: 强制刷新 UI
        };
        reader.readAsText(file, 'UTF-8');
    }


    exportSaves() {
        const saves = localStorage.getItem('WebGAL');
        if (saves === null) {
            // no saves
            return false;
        }
        const blob = new Blob([saves], { type: 'application/json' });
        const blobUrl = URL.createObjectURL(blob);
        URL.revokeObjectURL(this.dummyA.href);
        this.dummyA.href = blobUrl;
        this.dummyA.download = 'saves.json';
        this.dummyA.click();
        return true;
    }


    render() {
        return (
            <div className="importer-exporter">
                <span className="label-saves-exporter" onClick={() => { this.exportSaves(); }}>导出存档</span>
                <a target="_blank" id="dummy-saves-exporter" style={{display: "none"}}/>
                <span className="label-saves-importer" onClick={() => { this.dummyInput.click(); }}>导入存档</span>
                <input type="file" id="dummy-saves-importer" style={{display: "none"}} onChange={this.importSaves}/>
            </div>
        );
    }


    checkSyntax(text) {
        try {
            const json = JSON.parse(text);
        } catch (error) {
            return false;
        }
        return true;
    }
}

function ren_miniPic(i){
    let leftFigUrl = "./game/figure/"+Saves[i]["fig_Name_left"];
    let FigUrl = "./game/figure/"+Saves[i]["fig_Name"];
    let rightFigUrl = "./game/figure/"+Saves[i]["fig_Name_right"];
    let renderList= [];
    if(Saves[i]["fig_Name_left"]!=='none'&& Saves[i]["fig_Name_left"]!==''){
        let tempIn= <span className={"mini_fig mini_fig_left"}>
            <img src={leftFigUrl} alt={"mini_fig"} className={"mini_fig_pic"}/>
        </span>
        renderList.push(tempIn);
    }
    if(Saves[i]["fig_Name"]!=='none'&& Saves[i]["fig_Name"]!==''){
        let tempIn= <span className={"mini_fig mini_fig_center"}>
            <img src={FigUrl} alt={"mini_fig"} className={"mini_fig_pic"}/>
        </span>
        renderList.push(tempIn);
    }
    if(Saves[i]["fig_Name_right"]!=='none'&& Saves[i]["fig_Name_right"]!==''){
        let tempIn= <span className={"mini_fig mini_fig_right"}>
            <img src={rightFigUrl} alt={"mini_fig"} className={"mini_fig_pic"}/>
        </span>
        renderList.push(tempIn);
    }
    return <div id={"ren_SE" + i} className={"miniPic"}>
        {renderList}
    </div>;
}

class SettingButtons_font extends React.Component{
    constructor(props) {
        super(props);
        this.state = {buttonState : ['','','']}
    }

    componentDidMount() {
        let buttonStateNow = ['','',''];
        if(Settings['font_size'] === 'small'){
            buttonStateNow[0] = 'On';
        }else if (Settings['font_size'] === 'medium'){
            buttonStateNow[1] = 'On';
        }else if (Settings['font_size'] === 'large'){
            buttonStateNow[2] = 'On';
        }
        this.setState(
            {
                buttonState:buttonStateNow
            }
        )
    }


    componentWillUnmount() {
    }

    changeButtonState(i){
        if(i === 0){
            Settings['font_size'] = 'small';
            document.getElementById('SceneText').style.fontSize = '150%';
            document.getElementById('previewDiv').style.fontSize = '150%';
        }else if(i === 1){
            Settings["font_size"] = 'medium';
            document.getElementById('SceneText').style.fontSize = '200%';
            document.getElementById('previewDiv').style.fontSize = '200%';
        }else if(i === 2){
            Settings["font_size"] = 'large';
            document.getElementById('SceneText').style.fontSize = '250%';
            document.getElementById('previewDiv').style.fontSize = '250%';
        }
        let buttonStateNow = ['','',''];
        if(Settings['font_size'] === 'small'){
            buttonStateNow[0] = 'On';
        }else if (Settings['font_size'] === 'medium'){
            buttonStateNow[1] = 'On';
        }else if (Settings['font_size'] === 'large'){
            buttonStateNow[2] = 'On';
        }
        writeCookie();
        this.setState(
            {
                buttonState:buttonStateNow
            }
        )
    }


    render(){

        return(
            <span className="singleSettingItem">
                <span className="settingItemTitle">字体大小</span>
                <span className={'settingItemButton'+this.state.buttonState[0]} onClick={()=>{this.changeButtonState(0)}}>小</span>
                <span className={'settingItemButton'+this.state.buttonState[1]} onClick={()=>{this.changeButtonState(1)}}>中</span>
                <span className={'settingItemButton'+this.state.buttonState[2]} onClick={()=>{this.changeButtonState(2)}}>大</span>
            </span>
        );
    }

}

class SettingButtons_speed extends React.Component{
    constructor(props) {
        super(props);
        this.state = {buttonState : ['','','']}
    }

    componentDidMount() {
        let buttonStateNow = ['','',''];
        if(Settings['play_speed'] === 'low'){
            buttonStateNow[0] = 'On';
        }else if (Settings['play_speed'] === 'medium'){
            buttonStateNow[1] = 'On';
        }else if (Settings['play_speed'] === 'fast'){
            buttonStateNow[2] = 'On';
        }
        this.setState(
            {
                buttonState:buttonStateNow
            }
        )
    }


    componentWillUnmount() {
    }

    changeButtonState(i){
        if(i === 0){
            Settings['play_speed'] = 'low';
            textShowWatiTime = 55;
        }else if(i === 1){
            Settings["play_speed"] = 'medium';
            textShowWatiTime = 35;
        }else if(i === 2){
            Settings["play_speed"] = 'fast';
            textShowWatiTime = 20;
        }
        let buttonStateNow = ['','',''];
        if(Settings['play_speed'] === 'low'){
            buttonStateNow[0] = 'On';
        }else if (Settings['play_speed'] === 'medium'){
            buttonStateNow[1] = 'On';
        }else if (Settings['play_speed'] === 'fast'){
            buttonStateNow[2] = 'On';
        }
        writeCookie();
        this.setState(
            {
                buttonState:buttonStateNow
            }
        )
    }


    render(){

        return(
            <span className="singleSettingItem">
                <span className="settingItemTitle">播放速度</span>
                <span className={'settingItemButton'+this.state.buttonState[0]} onClick={()=>{this.changeButtonState(0)}}>慢</span>
                <span className={'settingItemButton'+this.state.buttonState[1]} onClick={()=>{this.changeButtonState(1)}}>中</span>
                <span className={'settingItemButton'+this.state.buttonState[2]} onClick={()=>{this.changeButtonState(2)}}>快</span>
            </span>
        );
    }

}

class LoadMainModel extends  React.Component{
    Buttons = [];
    SaveButtons = [];
    LoadPageQty = 0;
    setCurrentPage(page){
        currentLoadPage = page;
        this.setState({
            currentPage:currentLoadPage
        })
        writeCookie();
    }

    loadButtons(){
        this.Buttons = [];
        for (let i = 0; i < this.LoadPageQty; i++) {
            let temp =<span className="LoadIndexButton LS_indexButton" onClick={()=>{this.setCurrentPage(i)}} key={i}>{i+1}</span>
            if(i === currentLoadPage)
                temp =<span className="LoadIndexButtonOn LS_indexButtonOn" onClick={()=>{this.setCurrentPage(i)}} key={i}>{i+1}</span>
            this.Buttons.push(temp);
        }
    }

    loadSaveButtons(){
        this.SaveButtons = [];
        for (let i = currentLoadPage*6+1; i <= currentLoadPage*6+6; i++) {
            if(Saves[i]){
                let thisButtonName = Saves[i]["showName"];
                let thisButtonText = Saves[i]["showText"];
                let miniPic = ren_miniPic(i);
                let backUrl = "game/background/"+Saves[i]["bg_Name"];
                let temp = <div className="LoadSingleElement LS_singleElement" key={i} onClick={()=>{LoadSavedGame(i)}}>
                    <div className={"ren"} key={i} style={{backgroundImage: `url(${backUrl})`}}>
                        {miniPic}
                    </div>
                    <div>
                        <div className="LSE_top">
                            <span className={"LSE_index"}>{i}</span>
                            <span className={"LSE_name"}>{thisButtonName}</span>
                        </div>
                        <div className="LSE_bottom">
                            {thisButtonText}
                        </div>
                    </div>
                </div>
                this.SaveButtons.push(temp);
            }else
            {
                let temp = <div className="LoadSingleElement LS_singleElement" key={i}>空</div>
                this.SaveButtons.push(temp);
                // console.log(i)
            }

        }
    }

    constructor(props) {
        super(props);
        this.LoadPageQty = props.PageQty;
        this.state = {
            currentPage:currentLoadPage
        }
        this.loadButtons();
    }

    componentDidMount() {
    }


    componentWillUnmount() {
    }

    render(){
        this.loadButtons();
        this.loadSaveButtons();
        return(
            <div id="LoadMain" className={"LS_renderMain"}>
                <div id="LoadIndex" className={"LS_Index"}>
                    {this.Buttons}
                </div>
                <div id="LoadButtonList" className={"LS_ButtonList"}>
                    {this.SaveButtons}
                </div>
            </div>

        );
    }
}

class SaveMainModel extends  React.Component{
    Buttons = [];
    SaveButtons = [];
    LoadPageQty = 0;
    ren_bg_list = [];
    setCurrentPage(page){
        currentSavePage = page;
        this.setState({
            currentPage:currentSavePage
        })
        writeCookie();
    }

    loadButtons(){
        this.Buttons = [];
        for (let i = 0; i < this.LoadPageQty; i++) {
            let temp =<span className="SaveIndexButton LS_indexButton" onClick={()=>{this.setCurrentPage(i)}} key={i}>{i+1}</span>
            if(i === currentSavePage)
                temp =<span className="SaveIndexButtonOn LS_indexButtonOn" onClick={()=>{this.setCurrentPage(i)}} key={i}>{i+1}</span>
            this.Buttons.push(temp);
        }
    }

    loadSaveButtons(){
        this.SaveButtons = [];
        this.ren_bg_list = [];
        for (let i = currentSavePage*6+1; i <= currentSavePage*6+6; i++) {
            if(Saves[i]){
                let thisButtonName = Saves[i]["showName"];
                let thisButtonText = Saves[i]["showText"];
                let miniPic = ren_miniPic(i);
                let backUrl = "game/background/"+Saves[i]["bg_Name"];
                let temp = <div className="SaveSingleElement LS_singleElement" key={i} onClick={()=>{this.save_onSaved(i)}}>
                    <div className={"ren"} key={i} style={{backgroundImage: `url(${backUrl})`}}>
                        {miniPic}
                    </div>
                    <div>
                        <div className="LSE_top">
                            <span className={"LSE_index"}>{i}</span>
                            <span className={"LSE_name"}>{thisButtonName}</span>
                    </div>
                    <div className="LSE_bottom">
                        {thisButtonText}
                    </div>
                    </div>
                </div>
                this.SaveButtons.push(temp);
            }else
            {
                let temp = <div className="SaveSingleElement LS_singleElement" key={i} onClick={()=>{this.save_NonSaved(i)}}>空</div>
                this.SaveButtons.push(temp);
                // console.log(i)
            }

        }
    }

    save_NonSaved(index){
        saveGame(index);
        writeCookie();
        this.setState({
            currentPage:currentSavePage
        });
    }

    save_onSaved(index){
        showMesModel('你要覆盖这个存档吗','覆盖','不',function () {
            saveGame(index);
            writeCookie();
            closeSave();
        })
        this.setState({
            currentPage:currentSavePage
        });
    }

    constructor(props) {
        super(props);
        this.LoadPageQty = props.PageQty;
        this.state = {
            currentPage:currentSavePage
        }
        this.loadButtons();
    }

    componentDidMount() {
    }


    componentWillUnmount() {
    }

    render(){
        this.loadButtons();
        this.loadSaveButtons();
        return(
            <div id="SaveMain" className={"LS_renderMain"}>
                <div id="SaveIndex" className={"LS_Index"}>
                    {this.Buttons}
                </div>
                <div id="SaveButtonList" className={"LS_ButtonList"}>
                    {this.SaveButtons}
                </div>
            </div>

        );
    }
}

function ControlButton(props){
    if(props.id){
        return <div className={"newButton"} id={props.id} onClick={()=>{
            props.fun();
        }}>
            <span className={"nB_left"} style={{borderBottom:`3px solid ${props.color}`}}>{props.simpleName}</span>
            <span className={"nB_right"}>{props.name}</span>
        </div>
    }

    return <div className={"newButton"} onClick={()=>{
        props.fun();
    }}>
        <span className={"nB_left"} style={{borderBottom:`3px solid ${props.color}`}}>{props.simpleName}</span>
        <span className={"nB_right"}>{props.name}</span>
    </div>
}