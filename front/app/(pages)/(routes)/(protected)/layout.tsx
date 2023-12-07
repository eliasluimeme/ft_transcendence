import NavBar from "@/components/ui/NavBar";
import Head from "next/head";
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full p-3 gap-3 font-custom">
      <NavBar />
      <div className="absolute w-[30%] flex space-x-2 right-[10%] top-[5%]">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
        <input
          type="text"
          className="w-[100%] h-[2%] border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
        />
      </div>
      <main className="h-full w-full">{children}</main>
    </div>
  );
}
