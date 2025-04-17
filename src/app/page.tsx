import Image from "next/image";
import Visualizer from "@/components/vapi/visualizer";

export default function Home() {
    return (
        <main className="flex items-center justify-center h-screen">
            <Visualizer />
        </main>
    );
}
