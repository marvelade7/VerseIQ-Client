import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 lg:px-20 sm:px-10 px-4 py-2 shadow-md bg-white text-black">
            <img src="./logo.png" alt="Logo" className="md:w-37 w-24 shrink-0" />
            <ul className="md:flex hidden items-center lg:gap-10 md:gap-5">
                <li className="cursor-pointer hover:text-[#7C3AED] duration-300 font-medium">Dashboard</li>
                <li className="cursor-pointer hover:text-[#7C3AED] duration-300 font-medium">Leaderboard</li>
                <li className="cursor-pointer hover:text-[#7C3AED] duration-300 font-medium">Profile</li>
            </ul>
            <div className="flex items-center md:gap-5 gap-2 shrink-0">
                <Link to='signin'><button className="bg-white text-[#7C3AED] sm:px-4 px-3 sm:py-2 py-1.5 rounded-md border border-[#7C3AED] hover:bg-[#e9e3f4] cursor-pointer text-sm sm:text-base font-medium duration-300">Sign In</button></Link>
                <Link to='/signup'><button className="bg-[#7C3AED] hidden md:block text-white px-4 py-2 rounded-md hover:bg-[#5a28c4] font-medium cursor-pointer duration-300">Start Quiz</button></Link>
                <i className="bi bi-list md:hidden text-2xl cursor-pointer text-[#7C3AED]"></i>
            </div>
        </div>
    );
};

export default Navbar;
