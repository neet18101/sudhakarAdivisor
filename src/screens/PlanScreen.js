import { Text, View } from "react-native-animatable"
import Header from "../components/HomeScreen/Header"
import Plan from "../components/PlanScreen/Plan"

const PlanScreen = ({navigation}) => {
  
  return (
    <>
     
      <Header/>
      <Plan navigation={navigation}/>

    </>
  )
}

export default PlanScreen