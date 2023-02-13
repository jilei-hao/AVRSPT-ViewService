import btnFullScreen from "../../../assets/btn_full_screen__idle.svg"
import btnSplitScreen from "../../../assets/btn_split_screen.svg"

export default function ButtonLayout ({strSize, onClick, mode}) {
  const styleBtn = {
    width: strSize,
    height: strSize,
    borderRadius: "2%",
    marginTop: "2px",
    marginBottom: "2px",
    backgroundColor: "rgb(72, 72, 72)",
    border: "none",
  }

  const styleBtnIcon = {
    width: "100%",
    height: "100%",
    margin: "0px",
    padding: "0px"
  }

  const switchIconSrc = () => {
    switch (mode) {
      case "full_screen":
        return btnFullScreen;
      case "split_screen":
        return btnSplitScreen;
    }
  }

  return (
    <button style={styleBtn} onClick={onClick}>
      <img style={styleBtnIcon} src={switchIconSrc()}/>
    </button>
  )
}