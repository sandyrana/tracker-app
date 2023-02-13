
import { registerThemes } from "react-native-themed-styles"

const light = { backgroundColor: "white", textColor: "black" }
const dark = { backgroundColor: "black", textColor: "white" }

const styleSheetFactory = registerThemes(
  { light, dark }, // All themes you want to use.
  () => "light" // A function that returns the name of the default theme.
)

export { styleSheetFactory }