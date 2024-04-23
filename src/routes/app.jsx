import { AVRPViewer } from "../applications";
import { useParams } from "react-router-dom";


export default function App() {
  const { studyId } = useParams();

  return (
    <AVRPViewer studyId={studyId} />
  );
}