import { useRef, MutableRefObject } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
    const nav: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const toggleNav = () => {
        if (nav.current) {
            nav.current.classList.toggle('open');
        }
    };

    return (
        <>
            <div ref={nav} className="nav h-[100vh] bg-neutral-100 w-lvw fixed top-0 z-20">
                <div className="exit flex justify-end p-10">
                    <svg
                        className="w-14 h-14"
                        onClick={toggleNav}
                        viewBox="0 -0.5 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* SVG paths */}
                    </svg>
                </div>
                <div className="nav-list">
                    <ul className="flex flex-col justify-center items-center h-full gap-10">
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <Link to="/" onClick={toggleNav}> HOME</Link>
                        </li>
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <Link to="/#about" onClick={toggleNav}> ABOUT</Link>
                        </li>
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <Link to="/admin-login" onClick={toggleNav}> ADMIN LOGIN</Link> {/* Updated */}
                        </li>
                    </ul>
                </div>
            </div>
            <header className="flex justify-around items-center h-20 w-full shadow-md fixed top-0 bg-white z-10">
                <h1 className="text-lg font-bold">Sentiment</h1>
                <ul className="sm:flex items-center gap-4 hidden">
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <Link to="/"> HOME</Link>
                    </li>
                    <div className="inline-block h-7 w-[1px] bg-[#1b1b1b]"></div>
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <Link to="/#about"> ABOUT</Link>
                    </li>
                    <div className="inline-block h-7 w-[1px] bg-[#1b1b1b]"></div>
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <Link to="/admin-login"> ADMIN LOGIN</Link> {/* Updated */}
                    </li>
                </ul>
                <div>
                    <svg
                        onClick={toggleNav}
                        className="sm:hidden w-10 h-10 justify-end"
                        viewBox="-0.5 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* SVG paths */}
                    </svg>
                </div>
            </header>
        </>
    );
};
