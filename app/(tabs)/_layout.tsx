import TabBar from "@/components/TabBar"
import { useAuth } from "@/contexts/AuthContexts"
import { Redirect, Tabs } from "expo-router"
import * as Notifications from "expo-notifications"
import { useEffect } from "react"

export default function Layout() {
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        setNotificationHandler()
    }, [])


    if (!isAuthenticated) return <Redirect href={"/sign-in"} />

    // Check if notifications are allowed

    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false, // Hide the default header
                    animation: 'shift',
                }}

            />
            <Tabs.Screen
                name="UserList"
                options={{
                    title: "Friends",
                    headerShown: false, // Hide the default header
                    animation: 'shift',
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    title: "Settings",
                    headerShown: false, // Hide the default header
                    animation: 'shift',
                }}
            />
        </Tabs>
    )
}

export async function allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
        settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}

async function setNotificationHandler(){
    if (await allowsNotificationsAsync()) {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }
}