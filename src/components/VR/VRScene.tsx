import { gsap } from 'gsap';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import
{
    BoxGeometry, Color, Mesh, MeshBasicMaterial,
    PerspectiveCamera, Scene, TextureLoader, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import '../../assets/scss/VR.scss';
import { CONST_HOST } from '../Common/VariableGlobal';



@observer
export default class VRScene extends Component<{}, {}>
{
    VR_Scene = React.createRef<HTMLDivElement>();
    //渲染器
    renderer = new WebGLRenderer(
        { antialias: true }
    );
    css3DRenderer = new CSS3DRenderer();
    //场景
    scene = new Scene();
    //相机
    camera = new PerspectiveCamera(
        90,                                               //摄像机视锥体垂直视野角度
        document.body.clientWidth / document.body.clientHeight, //摄像机视锥体长宽比
        0.1,                                                    //近截面 小于不渲染
        1000                                                    //远截面 大于不不渲染
    );
    controler = new OrbitControls(this.camera, this.css3DRenderer.domElement || this.renderer.domElement);
    // arrowHelpers = {
    //     arrowHelperX: new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 250, "#FF0000"),
    //     arrowHelperY: new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 250, "#00FF00"),
    //     arrowHelperZ: new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 250, "#0000FF"),
    // };
    scene1: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/right.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/left.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/top.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/bottom.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/front.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/back.png`) })
    ];
    scene2: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/right_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/left_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/top_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/bottom_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/front_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_00/back_2.png`) })
    ];
    VR_Cube = new Mesh(
        new BoxGeometry(200, 200, 200),
        this.scene1
    );

    /**
     * @description 初始化场景
     */
    InitThree = () =>
    {
        const { renderer, css3DRenderer, scene, camera, VR_Scene } = this;

        // scene.add(arrowHelpers.arrowHelperX);
        // scene.add(arrowHelpers.arrowHelperY);
        // scene.add(arrowHelpers.arrowHelperZ);

        camera.position.set(0, 0, 5);
        camera.lookAt(scene.position);

        renderer.setClearColor(new Color('#FFFFFF'));
        renderer.setSize(document.body.clientWidth, document.body.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = 'absolute';
        VR_Scene.current!.appendChild(renderer.domElement);

        css3DRenderer.setSize(document.body.clientWidth, document.body.clientHeight);
        css3DRenderer.domElement.style.position = 'absolute';
        VR_Scene.current!.append(css3DRenderer.domElement);

        this.LoopRender();
    };

    /**
     * @description 添加VR的场景
     */
    AddIntoScene = () =>
    {
        const { scene, VR_Cube, camera } = this;
        let element = document.createElement('div');
        element.classList.add('VRNextSceneArrow');
        element.onclick = () =>
        {
            const { scene1, scene2 } = this;

            if (VR_Cube.material === this.scene1)
            {
                gsap.to(scene1, .5, { opacity: 0 });
                setTimeout(() =>
                {
                    VR_Cube.material = this.scene2;
                    gsap.to(scene2, 1, { opacity: 1 });
                    camera.position.set(0, 0, 5);
                    camera.lookAt(scene.position);
                }, 300);

                return;
            }
            if (VR_Cube.material === this.scene2)
            {
                gsap.to(scene2, .5, { opacity: 0 });
                setTimeout(() =>
                {
                    VR_Cube.material = this.scene1;
                    gsap.to(scene1, 1, { opacity: 1 });
                    camera.position.set(0, 0, 5);
                    camera.lookAt(scene.position);
                }, 300);

                return;
            }
        };
        let elements = document.createElement("div");
        elements.classList.add('VRNextSceneArrow');

        let object = new CSS3DSprite(element);
        let objects = new CSS3DSprite(elements);
        object.position.x = -50;
        object.position.y = 0;
        object.position.z = -300;

        objects.position.x = -180;
        objects.position.y = -20;
        objects.position.z = -300;
        // object.lookAt(camera.position);
        scene.add(object);
        scene.add(objects);

        VR_Cube.geometry.scale(1, 1, -1);
        scene.add(VR_Cube);
    };


    /**
     * @description 设置控制器选项
     */
    SetUpControl = () =>
    {
        const { controler } = this;
        controler.enablePan = false;
        controler.enableDamping = true;
        controler.dampingFactor = .2;
        controler.enableZoom = false;
        //反转操作
        controler.rotateSpeed *= -.3;
    };

    /**
     * @description 无限循环执行渲染,每一帧在都执行
     */
    LoopRender = () =>
    {
        const { renderer, css3DRenderer, scene, camera, controler } = this;
        requestAnimationFrame(this.LoopRender);
        css3DRenderer.render(scene, camera);
        renderer.render(scene, camera);
        controler.update();
    };

    /**
     * @description 窗口放大缩小时要重新渲染
     */
    ReSize = () =>
    {
        const { renderer, camera } = this;
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };
    componentDidMount()
    {
        window.onresize = () =>
        {
            this.ReSize();
        };
        this.VR_Scene.current!.onmousedown = (e: MouseEvent) =>
        {
            ((e.target) as HTMLCanvasElement).style.cursor = 'move';
        };
        this.VR_Scene.current!.onmouseup = (e: MouseEvent) =>
        {
            ((e.target) as HTMLCanvasElement).style.cursor = 'default';
        };
        this.InitThree();
        this.SetUpControl();
        this.AddIntoScene();
    }
    render()
    {
        return (
            <div className="Masking">
                <div
                    className="VRScene"
                    ref={this.VR_Scene} />
            </div >
        );
    }
}
