
import React from 'react';
import THREE from 'three';
import ReactTHREE from 'react-three';


class SceneViewerComponent extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        // Kick off animation
        this._animate();
    }

    render() {

        let CameraElement = React.createElement(
            ReactTHREE.PerspectiveCamera,   // type
            {                               // config
                name: 'camera',
                fov: 75,
                aspect: window.innerWidth / window.innerHeight,
                near: 1,
                far: 1000,
                position: new THREE.Vector3(0, 0, 50),
                lookat: new THREE.Vector3(0, 0, 0)
            }
        );

        let AmbientLight = React.createElement(
            ReactTHREE.AmbientLight,
            {
                color: new THREE.Color(0x333333),
                intensity: 0.5,
                target: new THREE.Vector3(0, 0, 0)
            }
        );

        let DirectionalLight = React.createElement(
            ReactTHREE.DirectionalLight,
            {
                color: new THREE.Color(0xFFFFFF),
                intensity: 1.5,
                position: new THREE.Vector3(0, 0, 60)
            }
        );

        return React.createElement(
            ReactTHREE.Scene,
            {
                width: window.innerWidth,
                height: window.innerHeight,
                camera: 'camera',
                antialias: true,
                background: 0xEEEEEE
            },
            CameraElement,
            AmbientLight,
            DirectionalLight
        )
    }

    _animate() {

 
        requestAnimationFrame(this._animate);

    }

};

export default SceneViewerComponent;