const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className="sm:py-10 py-7 lg:px-20 md:px-10 px-5 flex flex-col lg:flex-row bg-[#eeeaf5b1] justify-between items-center gap-5 text-center lg:text-left">
            <img src="./logo.png" width="120" height="100" />
            <p>&copy; {year} VerseIQ. All rights reserved.</p>
            <ul className="flex md:gap-5 gap-x-4 gap-y-2 flex-wrap justify-center">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Help Center</li>
                <li>Contact Us</li>
            </ul>
        </div>
    );
};

export default Footer;
