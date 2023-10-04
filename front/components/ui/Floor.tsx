interface FloorProps {
    With: string;
    Hight: string;
}

export default function Floor({ With, Hight }: FloorProps) {
    const className = `border border-white border-opacity-40 bg-white shadow-lg shadow-black-[0.03] backdrop-blur-[0.5rem] rounded-lg ${With} ${Hight}`;
    return (
      <div className={className}></div>
    )
}