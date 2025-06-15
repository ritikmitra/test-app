import { useAuth } from "@/contexts/AuthContexts"
import { Redirect, Slot } from "expo-router"

export default function Layout() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return <Redirect href={"/sign-in"} />

    return <Slot />
}
