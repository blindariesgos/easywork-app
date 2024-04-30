import { isLoggedIn } from '@/lib/apis';
import { redirect } from 'next/navigation';

const LoggedInProvider = async ({children}) => {
    const isLoguedIn = await isLoggedIn()
    if(!isLoguedIn){
        redirect("/auth")
    }
    
    return children;
}
 
export default LoggedInProvider;