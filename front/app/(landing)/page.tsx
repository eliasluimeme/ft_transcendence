// import { Button } from "@/components/ui/button";

// const LandingPage = () => {
//     return (
//         <div className="flex justify-center items-center h-screen">
//             <div className="text-white">
//                     <div className=" login text-white box-border h-96 w-96"></div>
//                     <h1 className="text-2xl font-bold">Login</h1>
//                     <h2 className="">Login With intra</h2>
//                     <Button variant="nik" className="">LOGIN NOW</Button>
//             </div>
//         </div>
//     );
// }
 
// export default LandingPage;
import { Button } from "@/components/ui/button";

const LandingPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="login box-border h-96 w-96 flex flex-col justify-center items-center rounded-lg bg-opacity-50">
                <h1 className="text-white text-2xl font-bold mb-9">Login</h1>
                <h2 className="text-white text-lg mb-9">Login With intra</h2>
                <Button variant="nik" className="font-bold">LOGIN NOW</Button>
            </div>
        </div>
    );
}
 
export default LandingPage;