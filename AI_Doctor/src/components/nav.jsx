import React from 'react'

const Nav = () => {
    return (
        <div className='w-full bg-purple-500 text-gray-200 h-10 flex justify-center text-center items-center flex-row gap-10'>
            <div className='font-bold'>AI Health Assistance</div>
            <div>
                <a href="#" className='hover:text-blue-500 scale-150 transition-transform hover:font-semibold '>Home</a>
            </div>
            <div>
                <a href="#" className='hover:text-blue-500 scale-150 transition-transform'>about project</a>
            </div>
            <div>
                <a href="#" className='transition-transform duration-300 hover:text-blue-500 scale-150 '>technology used</a>
            </div>
        </div>
    )
}

export default Nav
