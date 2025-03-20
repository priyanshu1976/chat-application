import React from 'react'
import { Loader } from "lucide-react"


function LoaderCom() {
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <Loader className="size-10 animate-spin" />
    </div>
  )
}

export default LoaderCom