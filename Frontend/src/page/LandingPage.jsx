const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mt-24">
        Welcome to <span className="text-orange-500">DevLab</span>
      </h1>
      <p className="text-white/80 mt-6 max-w-2xl text-lg">
        Practice coding, solve real-world problems, and collaborate with peers
        to become a better developer.
      </p>
    </div>
  );
};

export default LandingPage;
