import React from 'react'
import { ChevronLeft } from 'lucide-react';

const Return = ({ onclick, isViewing }) => {
    return (
        <div onClick={onclick} className={`${isViewing ? '' : 'hidden'} cursor-pointer`}>
            <ChevronLeft className='w-10 h-10 text-white/60 drop-shadow-md fixed top-20 left-5' />
        </div>
    )
}

export default Return
