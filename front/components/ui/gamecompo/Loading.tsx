import { FC } from 'react'

// interface LoadingProps {
  
// }

const Loading: FC<{}> = ({}) => {
  return(
   <div 
        className="w-[70%] border rounded-xl m-5 flex-1 justify-between flex flex-col max-h-[calc(100vh-6rem)]"
        style={{
        backgroundImage: "url('https://media1.giphy.com/media/32wMmUlL8th2tRCLBl/giphy.gif?cid=ecf05e47u44pvnj00ygrl4o1dhjcv1l6ltqicvuj8cfodngb&ep=v1_gifs_related&rid=giphy.gif&ct=g')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode : "screen"
   }}
        >
    <div
     className="flex justify-center items-center h-screen"
        >
      <button className="bg-gray-700 hover:bg-[#F87B3F] text-white font-bold py-6 px-8 rounded">Cancel</button>
    </div>
    </div>
  )
}

export default Loading