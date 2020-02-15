import 'ol/ol.css'
import './Map.css'
import React, { Component } from "react"
import OlMap from "ol/Map"
import OlView from "ol/View"
import OlLayerTile from "ol/layer/Tile"
import OlSourceOSM from "ol/source/OSM"
import * as proj from 'ol/proj'

import Main from '../template/Main'

class PublicMap extends Component {
    constructor(props) {
        super(props)

        this.state = { center: [0, 0], zoom: 14 }

        this.olmap = new OlMap({
            target: null,
            layers: [
                new OlLayerTile({
                    source: new OlSourceOSM()
                })
            ],
            view: new OlView({
                center: this.state.center,
                zoom: this.state.zoom
            })
        });
    }

    updateMap() {
        this.olmap.getView().setCenter(this.state.center);
        this.olmap.getView().setZoom(this.state.zoom);
    }

    componentDidMount() {
        this.olmap.setTarget("map")

        this.setState({ center: proj.transform([-52.668296, -27.091766], 'EPSG:4326', 'EPSG:3857'), zoom: 15 })

        this.olmap.on("moveend", () => {
            let center = this.olmap.getView().getCenter()
            let zoom = this.olmap.getView().getZoom()
            this.setState({ center, zoom })
        });
    }

    userAction() {
        this.setState({ center: proj.transform([-52.668296, -27.091766], 'EPSG:4326', 'EPSG:3857')})
    }

    render() {
        this.updateMap()
        return (
            <Main icon={"map"} title={"Localização"} subtitle={"Onde fica a X Solar Tech em Chapecó?"}>
                <div className={'body'}>
                    <h5>A empresa está localizada na rua ...</h5>
                    <div className={'map'}>
                        <div id="map">
                            <button className={'btn btn-primary'} onClick={e => this.userAction()}>Centralizar</button>
                        </div>
                    </div>
                </div>
            </Main>
        );
    }
}

export default PublicMap
