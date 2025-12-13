const Governance = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Governance</h1>
      <div className="card">
        <p className="text-gray-400 mb-2">
          Governance UI will show proposals, voting power, and allow voting using the platform token.
        </p>
        <p className="text-gray-400 text-sm">
          For now, proposals can be interacted with directly via a block explorer or Hardhat scripts while the
          on-chain governance flow is being finalized.
        </p>
      </div>
    </div>
  );
};

export default Governance;
