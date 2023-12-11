import React from "react";
import Image from "next/image";
import Link from "next/link";
interface DataButton {
  image: string;
  description: string;
  className: string;
  withImage: string;
  textSize: string;
  linking: string;
}
export default function Redirect(dataButton: DataButton) {
  return (
    <div
      className={`${dataButton.className} hover:bg-slate-500 hover:bg-opacity-[40%] ease-in-out duration-300`}
    >
      <Link href={`${dataButton.linking}`}>
        <button className="border rounded-lg grid grid-cols-3 w-[100%] h-[100%] ">
          <div className="w-[100%] h-[100%] flex items-center justify-center">
            <div className="w-[90%] h-[90%] relative">
              <Image
                className={`col-start-1 col-span-1 ${dataButton.withImage} rounded-lg`}
                src={dataButton.image}
                alt=""
                fill
              ></Image>
            </div>
          </div>
          <div className="col-start-2 col-span-2 flex items-center justify-center w-full h-full">
            <div className={`${dataButton.textSize}`}>
              {dataButton.description}
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}
