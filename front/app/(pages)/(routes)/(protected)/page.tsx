import Levels from "@/components/ui/Levels";
import GameHistory from "@/components/ui/GameHistory";

export default function page() {
  return (
    <div className="font-alfa-slab h-full grid grid-cols-3 gap-3">
      <div className="  bg-[#36393E] col-span-2 rounded-lg">
          <Levels />
      </div>
      <div className="  bg-[#36393E] rounded-lg">
        <GameHistory />
      </div>
    </div>
  );
}
