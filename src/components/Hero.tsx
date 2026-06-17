const Hero = () => {
    return (
        <div className="lg:py-20 md:py-15 py-12 lg:px-30 md:px-20 px-5">
            <h2 className="text-center font-semibold text-[#7C3AED] mt-5 lg:text-5xl md:text-4xl text-3xl">How well do you know the Bible?</h2>
            <p className="md:w-[80%] w-full text-center md:text-xl text-base sm:text-lg my-6 sm:my-8 mx-auto">Engage deeply with Scripture through our interactive quizzes. Test your knowledge, track your progress, and learn as you play in a focused, premium environment.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-8 sm:mt-10">
                <button className="w-full sm:w-auto bg-[#7C3AED] text-white text-base sm:text-lg px-4 py-2 rounded-md hover:bg-[#5a28c4] font-medium cursor-pointer duration-300">Start Quiz</button>
                <button className="w-full sm:w-auto bg-white text-[#7C3AED] text-base sm:text-lg px-4 py-2 rounded-md border border-[#7C3AED] hover:bg-[#e9e3f4] cursor-pointer font-medium duration-300">Register</button>
            </div>
        </div>
    );
};

export default Hero;
