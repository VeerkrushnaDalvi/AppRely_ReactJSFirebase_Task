// Filename - App.js
import React from 'react'
import { TailSpin } from "react-loader-spinner";

export const Loading = async () => {
    await setInterval(Function(), 4000);
    return (
        <TailSpin   // Type of spinner
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    )
}

