import btnReset from "../assets/btn_reset__idle.svg"

export default function ButtonReset ({strSize, onClick}) {
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

  return (
    <button style={styleBtn} onClick={onClick}>
      <img style={styleBtnIcon} src={btnReset}/>
    </button>
  )
}