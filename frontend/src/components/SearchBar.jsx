import React from 'react'
import { SearchIcon } from 'lucide-react';

function SearchBar({ mode, addStyle }) {
    return (
        <div className={`w-full p-4 flex flex-col items-center justify-center ${addStyle}`}>
            <div className={`${mode ? 'bg-white text-black' : 'bg-neutral-500 text-white'} w-[90%] px-8 max-w-[80em] overflow-hidden rounded-full shadow-md flex flex-row items-center justify-between`}>
                <input
                    className='w-[90%] p-3 focus:outline-none '
                    type="text"
                    placeholder='Search..' />
                <button>
                    <SearchIcon className='w-6 h-6 text-neutral-400' />
                </button>
            </div>
        </div>
    )
}

export default SearchBar
