import Join from "@/components/Buttons/Join/Join";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="main-line">
        <h1>Welcome Johnwick</h1>
        <Image className="truck-image" src="./truck.svg" alt="truck" width={300} height={300} />
        <div className="flex mt-6">
          <Join />
        </div>
      </main>
    </>
  );
}
