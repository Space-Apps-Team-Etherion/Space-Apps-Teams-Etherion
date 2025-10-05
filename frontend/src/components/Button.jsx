import React from 'react'

function Button({ content, onclick, addStyle }) {
    return (
        <button
            className={`cursor-pointer bg-blue-500 w-max flex flex-row items-center justify-center rounded-lg text-lg p-3 px-5 text-white ${addStyle}`}
            onClick={onclick}
        >
            {content}
        </button>
    )
}

export default Button
