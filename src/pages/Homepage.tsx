import { useState } from "react";
import { HowToUse } from "../components/About";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { RiseLoader } from "react-spinners";

export const Homepage = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            {isLoading && (
                <>
                    <div className="z-[55] h-screen w-screen fixed top-0 flex justify-center items-center">
                        <RiseLoader color="#f5f5f5" size={24} margin={5} />
                    </div>
                    <div className="h-screen w-screen fixed bg-neutral-500 top-0 z-50 bg-opacity-70"></div>
                </>
            )}

            <Header />
            <div className="mt-20"> {/* Ensure content is below the fixed Header */}
                <Hero setIsLoading={setIsLoading} />
                <HowToUse />
                <Footer />
            </div>
        </>
    );
};
