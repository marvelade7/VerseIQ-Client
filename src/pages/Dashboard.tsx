// const Dashboard = () => {
//     return (
//         <div>
//             <h1 className="text-3xl font-bold text-center mt-10">
//                 Welcome to Your Dashboard
//             </h1>
//             <p className="text-center text-gray-600 mt-4">
//                 This is where you can access your quizzes, track your progress,
//                 and explore new content.
//             </p>
//         </div>
//     );
// };

// export default Dashboard;

import { useAuth } from "../context/AuthContext"; // 👈 import the hook

const Dashboard = () => {
    const { user } = useAuth(); // 👈 grab the user from the noticeboard

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">
                Welcome, {user?.firstName} {user?.lastName} 👋
            </h1>
            <p className="text-center text-gray-600 mt-4">
                This is where you can access your quizzes, track your progress,
                and explore new content.
            </p>

            {/* You can start using any user data like this */}
            <div className="flex justify-center gap-6 mt-8">
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Total Quizzes Taken</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">{user?.totalQuizTaken}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Best Score</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">{user?.bestScore}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Longest Streak</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">{user?.longestStreak}</p>
                </div>
            </div>

            <button className="bg-[#7C3AED] text-white py-2 px-4 rounded-md hover:bg-[#6D28D9] transition-colors duration-300 mt-8">
                Start Quiz
            </button>
        </div>
    );
};

export default Dashboard;