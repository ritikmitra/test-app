import { Redirect, Slot } from 'expo-router'
import { useAuth } from '@/contexts/AuthContexts'

const AuthRoutesLayout = () => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Redirect href={'./'} />
    }
    return <Slot />
}

export default AuthRoutesLayout