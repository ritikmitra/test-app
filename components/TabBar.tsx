import { StyleSheet } from 'react-native'
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/constants/color';
import { BlurView } from 'expo-blur';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {


    const primaryColor = COLORS.primary;
    const greyColor = '#737373';
    return (
        <BlurView style={styles.tabbar} intensity={50}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const rawLabel =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const label = typeof rawLabel === 'string' ? rawLabel : route.name;

                if (['_sitemap', '+not-found'].includes(route.name)) return null;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        style={styles.tabbarItem}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name as "index" | "Settings" | "Admin" | "UserList"}
                        color={isFocused ? primaryColor : greyColor}
                        label={label}
                    />
                )
            })}
        </BlurView>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.29)',
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center'
    }
})

export default TabBar