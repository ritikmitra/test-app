import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

const index = () => {

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};


export default index;