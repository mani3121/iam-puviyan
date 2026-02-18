const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white overflow-auto h-screen">
      <iframe
        title="Privacy Policy"
        src="/policy.html"
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PrivacyPolicy;
