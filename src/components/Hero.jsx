import React from 'react';
import playerImage from '../assets/JohnnyDavis-removebg.png';
import logo from '../assets/logo.png';
import BackgroundPic from '../assets/background2.jpg';

const Hero = () => {
  return (
    <div
      className="text-white w-full h-[95vh] flex justify-center items-center"
      style={{
        backgroundImage: `url(${BackgroundPic})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-8">
        <div className="flex flex-wrap justify-center items-center ">
          <div className="px-4 lg:w-[55%]">
            <div className="h-full px-6 pt-24 pb-24 rounded-xl overflow-hidden text-center relative">
              <div
                className="absolute inset-0 bg-red-800 opacity-55 rounded-xl"
                style={{
                  backgroundImage: `url(${logo})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div className="relative">
                <h1 className="block font-mono font-bold text-6xl leading-none text-slate-200 underline">
                  Discover Insights,{' '}
                  <span className="block">Elevate Your Game.</span>
                </h1>
                <p className="leading-relaxed text-4xl text-gray-200 ">
                  Dive deep into the analytics of basketball and emerge with a
                  winning edge.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 lg:w-[45%]">
            <div className="h-[80vh] p-8 rounded-lg overflow-hidden text-center relative">
              <img
                src={playerImage}
                alt="Basketball Player"
                className="h-full w-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
