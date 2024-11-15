import {Text, View} from "react-native-animatable";
import ComplaintsChat from "../components/Complaints/ComplaintsChat";

const CompalaintsChatScreen = ({navigation}) => {
    return (
        <View style={{ flex:1}}>
          <ComplaintsChat navigation={navigation}/>
        </View>
    );
};

export default CompalaintsChatScreen
