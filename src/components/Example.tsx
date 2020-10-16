import React from 'react'

export const Example:React.FC<{
    samples: any
}> = function ({ samples }) {
    return (
        <>
            { !!samples && <span> [<i>{samples}</i>]</span> }
        </>
    )
}