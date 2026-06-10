const SignUpLeftSection = () => {
  return (
    <div className="hidden md:flex md:flex-col md:gap-6 items-start text-white justify-center lg:px-20 md:px-10 px-5 py-10 bg-[#7C3AED] h-screen w-1/2 ">
        <h3 className="text-4xl font-bold">Deepen Your Understanding of Scripture</h3>
        <p className="text-lg">Challenge yourself with carefully crafted Bible quizzes, track your growth, and strengthen your knowledge of God's Word one verse at a time.</p>
        <div className="mt-7 animate-[bounce_4s_ease-in-out_infinite] rounded-lg py-6 px-8 bg-[#e3d5fb36]">
          <i className="bi bi-quote text-3xl"></i>
          <p className="text-xl font-bold"><i>"Thy word is a lamp unto my feet, and a light unto my path."</i></p>
          <p className="text-sm mt-5 font-light">- Psalm 119:105</p>
        </div>
    </div>
  )
}

export default SignUpLeftSection