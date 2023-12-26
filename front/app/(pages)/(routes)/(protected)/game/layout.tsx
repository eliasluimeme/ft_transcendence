import { MyContextProvider } from '@/components/game/tools/MyContextProvider';

export default function StartLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <MyContextProvider>
            <div className="w-full h-full">{children}</div>
        </MyContextProvider>
    );
}