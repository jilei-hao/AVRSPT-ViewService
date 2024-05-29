import { useAVRPGlobal } from "../avrp_global_context"
import StudyBrowserPage from "../study_browser_page"
import ViewerPage from "../viewer_page"

export default function MainPage() {
  const { studyBrowserActive } = useAVRPGlobal();
  return (
    studyBrowserActive ? (<StudyBrowserPage />) : (<ViewerPage />)
  )
}