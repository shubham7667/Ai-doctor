import React from "react";

const Hero = () => {
  return (
    <section className="w-full min-h-[500px] bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white flex items-center">
      
      <div className="container mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">

          <span
            className="
              block
              font-extrabold
              text-6xl
              md:text-7xl
              lg:text-8xl
              leading-tight
              bg-gradient-to-r
              from-white
              via-cyan-200
              to-cyan-400
              bg-clip-text
              text-transparent
              drop-shadow-lg
            "
          >
            Health Assistance
          </span>

          <div className="mt-6 h-1 w-32 mx-auto md:mx-0 rounded-full bg-gradient-to-r from-cyan-300 to-white" />

        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2">

          <p
            className="
              text-lg
              md:text-xl
              lg:text-2xl
              leading-relaxed
              text-purple-100
              text-center
              md:text-left
              max-w-2xl
            "
          >
            Welcome to{" "}
            <span className="font-semibold text-white">
              AI Health Assistance
            </span>
            , where you can get intelligent assistance for preliminary
            health screening. Simply upload an image and ask questions
            related to your health concerns.
          </p>

          <button
            className="
              mt-8
              px-7
              py-3
              rounded-full
              bg-white
              text-purple-600
              font-semibold
              shadow-lg
              hover:bg-cyan-300
              hover:text-purple-800
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Get Started →
          </button>

        </div>

      </div>
    </section>
  );
};

export default Hero;