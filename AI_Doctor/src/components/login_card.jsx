import React from "react";
import { Link } from "react-router-dom";

const Login_card = () => {
  return (
    <div
      className="
        w-full
        max-w-5xl
        min-h-[300px]
        mx-auto
        my-10
        px-6
        py-10
        bg-white
        text-indigo-600
        font-sans
        flex
        flex-col
        md:flex-row
        items-center
        justify-around
        gap-10
        rounded-2xl
        shadow-lg
      "
    >

      {/* Free Trial */}
      <div
        className="
          w-full
          md:w-1/2
          flex
          flex-col
          items-center
          text-center
          gap-6
        "
      >
        <p className="text-xl md:text-2xl font-semibold">
          Experience one free trial of what we provide.
        </p>
        <Link to='/demo'>
          <button
            className="
            w-[200px]
            h-[50px]
            bg-indigo-500
            text-gray-200
            rounded-full
            font-semibold
            transition-all
            duration-300
            hover:bg-indigo-600
            hover:text-white
            hover:scale-105
            shadow-md
          "
          >
            Try Now
          </button>
        </Link>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-32 w-px bg-gray-200" />
      <div className="block md:hidden w-32 h-px bg-gray-200" />

      {/* Login */}
      <div
        className="
          w-full
          md:w-1/2
          flex
          flex-col
          items-center
          text-center
          gap-6
        "
      >
        <p className="text-xl md:text-2xl font-semibold">
          Login to get a seamless experience of our product.
        </p>
        <Link to='/login'>
        <button
          className="
            w-[200px]
            h-[50px]
            bg-indigo-500
            text-gray-200
            rounded-full
            font-semibold
            transition-all
            duration-300
            hover:bg-indigo-600
            hover:text-white
            hover:scale-105
            shadow-md
          "
        >
          Login
        </button>
        </Link>
      </div>

    </div>
  );
};

export default Login_card;