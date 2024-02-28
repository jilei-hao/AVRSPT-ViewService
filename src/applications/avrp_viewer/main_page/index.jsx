import { useAVRPData } from "../avrp_data_context";

export default function MainPage() {
  const { studyId } = useAVRPData();

  return (
    <h1>AVRP Viewer Main Page: StudyId: {studyId} </h1>
  );
}