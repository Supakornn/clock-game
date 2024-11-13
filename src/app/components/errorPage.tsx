const ErrorPage = () => {
  // Function to handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Sad Face Icon */}
      <div className="mb-8">
        <svg className="w-16 h-16" viewBox="0 0 24 24" stroke="none" fill="#6B7280">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
          <circle cx="12" cy="16" r="1" />
          <path d="M11 7h2v7h-2z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-[#202124] text-2xl font-normal mb-4">This page isn&apos;t working</h1>

      {/* Message */}
      <p className="text-[#48484A] mb-2">
        <span>jabvela.com</span> is currently unable to handle this request.
      </p>

      {/* Error Code */}
      <p className="text-[#48484A] mb-8">HTTP ERROR 500</p>

      {/* Reload Button with onClick handler */}
      <button
        onClick={handleRefresh}
        className="bg-[#1a73e8] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1557b0] transition-colors"
      >
        Reload
      </button>

      <style jsx>{`
        @font-face {
          font-family: "Roboto";
          src: url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
        }

        div {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
