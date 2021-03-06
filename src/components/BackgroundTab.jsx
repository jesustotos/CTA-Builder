import React, { Component } from "react";
import Select from 'react-select';
import Pickr from '@simonwep/pickr';
import { SWATCHES, PICKR_CONFIG, CLOSE_POSITIONS } from "../defines";
import ShadowList from "./ShadowList";
import Switch from "../components/Switch";

class BackgroundTab extends Component {
  constructor(props) {
    super(props);

    this.bgColorPickr = React.createRef();
    this.strColorPickr = React.createRef();

    this.pickerBG = null;
    this.pickerSTR = null;

    this.isTypeColor = false;
  }

  componentDidMount() {

    this.initPicker();

  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if ((data.background != prevProps.data.background) || (data.stroke != prevProps.data.stroke)) {
      this.isTypeColor = true;
      this.pickerBG.setColor(data.background);
      this.pickerSTR.setColor(data.stroke);

      setTimeout(()=>{
        this.isTypeColor = false;
      }, 600);
    }
  }


  initPicker = () => {
    const { onUpdate } = this.props;
    let {data} = this.props;

    this.pickerBG = Pickr.create({
      el: this.bgColorPickr.current,
      theme: PICKR_CONFIG.THEME,
      default: data.background,
      swatches: SWATCHES,
      components: PICKR_CONFIG.COMPONENTS,
      strings: PICKR_CONFIG.SAVE
    });

    this.pickerBG.on('change', (color) => {
      if (!this.isTypeColor) {
        data = this.props.data;
        this.pickerBG.setColor(String(color.toHEXA()));
        data.background = "#" + color.toHEXA().join('');
        onUpdate(data)
      }
    })

    this.pickerBG.on('clear', () => {
      data = this.props.data;
      data.background = '';
      onUpdate(data)
    })

    this.pickerSTR = Pickr.create({
      el: this.strColorPickr.current,
      theme: PICKR_CONFIG.THEME,
      default: data.stroke,
      swatches: SWATCHES,
      components: PICKR_CONFIG.COMPONENTS,
      strings: PICKR_CONFIG.SAVE
    });

    this.pickerSTR.on('change', (color) => {
      if (!this.isTypeColor) {
        data = this.props.data;
        this.pickerSTR.setColor(String(color.toHEXA()));
        data.stroke = "#" + color.toHEXA().join('');
        onUpdate(data)
      }
    })

    this.pickerSTR.on('clear', () => {
      data = this.props.data;
      data.stroke = '';
      onUpdate(data)
    })
  }

  onChangeBG = (e) => {
    const { data, onUpdate } = this.props;

    this.isTypeColor = true;
    data.background = e.target.value;
    onUpdate(data);
    e.target.value.length > 0 ? this.pickerBG.setColor(e.target.value) : this.pickerBG.setColor(null)

    setTimeout(() => {
      this.isTypeColor = false;
    }, 500)
  }

  onChangeStroke = (e) => {
    const { data, onUpdate } = this.props;

    this.isTypeColor = true;
    data.stroke = e.target.value;
    onUpdate(data);
    e.target.value.length > 0 ? this.pickerSTR.setColor(e.target.value) : this.pickerSTR.setColor(null)

    setTimeout(() => {
      this.isTypeColor = false;
    }, 500)
  }

  onShadowUpdate = (value) => {
    const { data, onUpdate } = this.props;
    data.shadow = value;
    onUpdate(data);
  }

  getPositionValue = () => {
    const { data } = this.props;
    let pos = {};
    CLOSE_POSITIONS.forEach((position)=>{
      if(data.closePosition == position.value) pos = position
    })

    return pos;
  }

  onIsPoweredToggle = (e) => {
    const { data, onUpdate } = this.props;
    e.target.checked ? data.isPowered = true : data.isPowered = false;
    onUpdate(data);
  }

  render() {

    const { data, onUpdate } = this.props;

    return (
      <div className="cta-tab-content">
        <div className="cta-tab active">
          <div className="cta-group bb-0">
            <div className="cta-inline">
              <div>
                <label>Background</label>
                <div className="cta-color-input">
                  <div className="color-picker" ref={this.bgColorPickr}></div>
                  <input type="text" value={data.background} onChange={this.onChangeBG} placeholder="None" />
                </div>
              </div>
              <div>
                <label>Border color</label>
                <div className="cta-color-input">
                  <div className="color-picker" ref={this.strColorPickr}></div>
                  <input type="text" value={data.stroke} onChange={this.onChangeStroke} placeholder="None" />
                </div>
              </div>
            </div>
            <div className="cta-inline">
              <div>
                <label>Roudness</label>
                <div className="cta-size-input"><input type="number" value={data.corner} onChange={(e) => { data.corner = e.target.value; onUpdate(data) }} placeholder="eq: 4" /></div>
              </div>
              <div>
                <label>Max. width</label>
                <div className="cta-size-input"><input type="number" value={data.width}  onChange={(e) => { data.width = e.target.value; onUpdate(data) }} placeholder="" /></div>
              </div>
            </div>
            <div className="cta-inline">
              <div>
                <label>Close button</label>
                <Select
                  value={this.getPositionValue()}
                  onChange={(value)=>{data.closePosition = value.value; onUpdate(data)}}
                  options={CLOSE_POSITIONS}
                  className={"cta-select"}
                  classNamePrefix={"cta-select"}
                />
              </div>
              <div>
                <label>Drop shadow</label>
                <ShadowList onUpdate={this.onShadowUpdate} value={data.shadow}/>
              </div>
            </div>
            <Switch isActive={data.isPowered} onUpdate={this.onIsPoweredToggle} label="Powered By SimpleTexting.com"/>
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundTab;