'use client'

export function Classroom() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-violet-200 via-fuchsia-100 to-cyan-200 relative overflow-hidden">
      {/* Classroom Background Elements */}
      <div className="absolute inset-0">
        {/* Floor */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-emerald-300 to-emerald-200" />
        
        {/* Back Wall */}
        <div className="absolute inset-0 bottom-1/3 bg-gradient-to-b from-amber-200 to-orange-100" />
        
        {/* Decorative Elements - Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full px-8">
          <div className="flex justify-between">
            <div className="w-32 h-24 bg-white/90 rounded-xl shadow-lg p-3 rotate-[-2deg] border-4 border-pink-200">
              <div className="text-xl font-bold text-pink-500 mb-1">ABC</div>
              <div className="text-sm text-pink-600">Learning is Fun!</div>
            </div>
            <div className="w-32 h-24 bg-white/90 rounded-xl shadow-lg p-3 rotate-[2deg] border-4 border-purple-200">
              <div className="text-xl font-bold text-purple-500 mb-1">123</div>
              <div className="text-sm text-purple-600">Count with us!</div>
            </div>
          </div>
        </div>

        {/* Rainbow Arc */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-red-300 via-yellow-300 to-blue-300 opacity-50 rounded-b-full transform -translate-y-1/2" />
      </div>

      {/* Teacher Section - Left Side */}
      <div className="absolute bottom-8 left-8 text-center">
        <div className="relative w-72 h-72">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full animate-pulse opacity-30" />
          <img
            src="/placeholder.svg?height=288&width=288"
            alt="Teacher"
            className="w-72 h-72 rounded-full border-8 border-white shadow-2xl"
          />
        </div>
        <div className="mt-4 bg-white/95 rounded-full px-8 py-3 shadow-xl border-4 border-purple-200">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Ms. Smith
          </h2>
        </div>
        
        {/* Speech Bubble */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-8 py-4 shadow-xl max-w-xs border-4 border-blue-200">
          <div className="text-lg font-medium text-gray-800">Hello everyone! 👋</div>
          {/* Speech Bubble Triangle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-200 transform rotate-45" />
        </div>
      </div>

      {/* Decorative Elements - Bottom */}
      {/* <div className="absolute bottom-4 left-4 flex space-x-3">
        {['bg-pink-300', 'bg-purple-300', 'bg-blue-300'].map((color, i) => (
          <div
            key={i}
            className={`w-16 h-20 ${color} rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-200 border-4 border-white`}
            style={{ rotate: `${(i - 1) * 8}deg` }}
          />
        ))}
      </div> */}
      
      <div className="absolute bottom-4 right-4 flex space-x-3">
        {['bg-yellow-300', 'bg-green-300', 'bg-orange-300'].map((color, i) => (
          <div
            key={i}
            className={`w-16 h-20 ${color} rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-200 border-4 border-white`}
            style={{ rotate: `${(1 - i) * 8}deg` }}
          />
        ))}
      </div>
    </div>
  )
}

