const InfoSection = () => {
    return (
        <div className='grid md:grid-cols-3 grid-cols-1 gap-5 lg:px-20 md:px-10 px-5 pt-10 sm:pb-30 pb-20'>
            <div className='border rounded-lg py-5 px-6 hover:shadow-lg duration-100 hover:border-[#7C3AED]'>
                <i className="bi bi-mortarboard text-2xl py-2 px-3 bg-[#d9d1e7] text-[#7C3AED] rounded-full"></i>
                <h4 className="mt-9 text-xl font-medium mb-4">3 Difficulty Levels</h4>
                <p className="text-md">From beginner friendly overviews to scholarly deep-dives, choose the challenge that hits your study.</p>
            </div>
            
            <div className='border rounded-lg py-5 px-6 hover:shadow-lg duration-100 hover:border-[#7C3AED]'>
                <i className="bi bi-trophy text-2xl py-2 px-3 bg-[#d9d1e7] text-[#7C3AED] rounded-full"></i>
                <h4 className="mt-9 text-xl font-medium mb-4">Live Leaderboard</h4>
                <p className="text-md">Compete with friends or the global community. See how your scriptural knowledge stacks up.</p>
            </div>
            
            <div className='border rounded-lg py-5 px-6 hover:shadow-lg duration-100 hover:border-[#7C3AED]'>
                <i className="bi bi-graph-up-arrow text-2xl py-2 px-3 bg-[#d9d1e7] text-[#7C3AED] rounded-full"></i>
                <h4 className="mt-9 text-xl font-medium mb-4">Track Your Progress</h4>
                <p className="text-md">Monitor your improvement over time with detailed analytics and insights  .</p>
            </div>
        </div>
    );
};

export default InfoSection;