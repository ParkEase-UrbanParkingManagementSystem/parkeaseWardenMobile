import { LinearGradient } from "expo-linear-gradient";
import colors from '@/constants/Colors'
import { ToastProvider } from 'react-native-toast-notifications';
import LoginScreen from '@/screens/auth/login/login.screen'

export default function Login() {
    return (
        <ToastProvider>
        <LoginScreen />
      </ToastProvider>
    )
}
