
import { Button } from "@/components/ui/button";

const LandingPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="login box-border h-96 w-96 flex flex-col justify-center items-center rounded-lg bg-opacity-50">
                <div className="text-white text-2xl font-bold mb-9">Login</div>
                <div className="text-white text-lg mb-9">Login With intra</div>
                <Button variant="nik" className="font-bold">LOGIN NOW</Button>
            </div>
        </div>
    );
}
 
export default LandingPage;