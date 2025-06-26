import TabBar from "@/components/TabBar"
import { useAuth } from "@/contexts/AuthContexts"
import { Redirect, Tabs } from "expo-router"

export default function Layout() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return <Redirect href={"/sign-in"} />

    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false, // Hide the default header
                    animation : 'shift',
                }}
                
            />
            <Tabs.Screen
                name="UserList"
                options={{
                    title: "Friends",
                    headerShown: false, // Hide the default header
                    animation : 'shift',
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    title: "Settings",
                    headerShown: false, // Hide the default header
                    animation : 'shift',
                }}
            />
        </Tabs>
    )
}
