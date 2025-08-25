import { useParams } from "react-router-dom";

const ProblemPage = () => {
  const { id } = useParams();
  return <div>ProblemPage : {id}</div>;
};

export default ProblemPage;
