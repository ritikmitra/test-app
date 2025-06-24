import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    index: (props: any) => <AntDesign name="home" size={26} {...props} />,
    Settings: (props: any) => <Feather name="settings" size={26} {...props} />,
    Admin: (props: any) => <AntDesign name="pluscircleo" size={26} {...props} />,
    UserList: (props: any) => <AntDesign name="user" size={26} {...props} />,
}