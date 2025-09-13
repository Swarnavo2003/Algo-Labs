const Hints = ({ hints }: { hints: string }) => {
  return (
    <div className="h-[650px] p-4">
      <p>{hints === "" ? "No hints available" : hints || ""}</p>
    </div>
  );
};

export default Hints;
