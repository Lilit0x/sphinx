"use client"

import dynamic from "next/dynamic"

const UploadComponent = dynamic(() => import("@/app/components/Uploader"), {
  ssr: false,
})

const Upload = () => {
  return <UploadComponent />
}

export default Upload
