import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/contexts/AuthContexts'

const AuthRoutesLayout = () => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Redirect href={'/'} />
    }
    return <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }} />
}

export default AuthRoutesLayout