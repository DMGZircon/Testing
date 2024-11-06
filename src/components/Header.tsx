import { useRef, MutableRefObject } from "react";

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
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
                                fill="#1b1b1b"
                            />
                        </g>
                    </svg>
                </div>
                <div className="nav-list">
                    <ul className="flex flex-col justify-center items-center h-full gap-10">
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <a href="#home" onClick={toggleNav}> HOME</a>
                        </li>
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <a href="#about" onClick={toggleNav}> ABOUT</a>
                        </li>
                        <li className="cursor-pointer hover:-translate-y-1 font-medium text-2xl">
                            <a href="#admin" onClick={toggleNav}> ADMIN LOGIN</a> {/* Updated line */}
                        </li>
                    </ul>
                </div>
            </div>
            <header className="flex justify-around items-center h-20 w-full shadow-md fixed top-0 bg-white z-10">
                <h1 className="text-lg font-bold">Sentiment</h1>
                <ul className="sm:flex items-center gap-4 hidden">
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <a href="#home"> HOME</a>
                    </li>
                    <div className="inline-block h-7 w-[1px] bg-[#1b1b1b]"></div>
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <a href="#about"> ABOUT</a>
                    </li>
                    <div className="inline-block h-7 w-[1px] bg-[#1b1b1b]"></div>
                    <li className="cursor-pointer hover:-translate-y-1 font-medium">
                        <a href="#admin"> ADMIN LOGIN</a> {/* Updated line */}
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
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M2 12.32H22"
                                stroke="#1b1b1b"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 18.32H22"
                                stroke="#1b1b1b"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 6.32001H22"
                                stroke="#1b1b1b"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                </div>
            </header>
        </>
    );
};
