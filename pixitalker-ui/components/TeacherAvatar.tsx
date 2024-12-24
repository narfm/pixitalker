import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useRive, Layout } from "@rive-app/react-canvas";
import { FC } from 'react';

const TeacherAvatar = () => {
  const { rive, RiveComponent } = useRive({
    src: '/head_tracking_rig.riv',
    layout: new Layout(),
    autoplay: false,
    stateMachines: ["loopSquash", "loopIdle", "Fly 2 Movement", "Fly1 Wings"]
  });

  return (
    <div style={{ width: "800px", height: "800px" }}>
      <RiveComponent
      onMouseEnter={() => rive && rive.play()}
      onMouseLeave={() => rive && rive.pause()}
    />
    </div>
  );
};

export default TeacherAvatar;