'use client'

import { useRive, Layout } from "@rive-app/react-canvas";


interface TeacherAvatarProps {
  name: string;
  message?: string;
  imageSrc?: string;
}

export function TeacherAvatar({ name, message = "Hello everyone! 👋", imageSrc = "/placeholder.svg?height=288&width=288" }: TeacherAvatarProps) {

    const { rive, RiveComponent } = useRive({
        src: '/tulsa.riv',
        layout: new Layout(),
        autoplay: true,
        stateMachines: ["loopSquash", "loopIdle", "Fly 2 Movement", "Fly1 Wings"]
      });
  return (
    <div className="absolute bottom-8 left-8 text-center">
      <div className="relative w-72 h-72">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-0" />
        {
        <div className="w-72 h-72 rounded-full border-8 border-white shadow-2xl">
        <RiveComponent
        onMouseEnter={() => rive && rive.play()}
        onMouseLeave={() => rive && rive.pause()}
      />
      </div>}
      </div>
      <div className="mt-4 bg-white/95 rounded-full px-8 py-3 shadow-xl border-4 border-purple-200">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          {name}
        </h2>
      </div>
      
      {/* Speech Bubble */}
      {/* <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-8 py-4 shadow-xl max-w-xs border-4 border-blue-200">
        <div className="text-lg font-medium text-gray-800">{message}</div> */}
        {/* Speech Bubble Triangle */}
        {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-200 transform rotate-45" />
      </div> */}
    </div>
  )
} 