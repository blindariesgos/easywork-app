// 'use client';

import AppContextProvider from '../../../context/app/provider';
import Sidebar from '../../../components/Sidebar';
import LoggedInProvider from '../../../components/Providers/LoggedInProvider';
import { SessionProvider } from 'next-auth/react';

export default function HomeLayout({ children }) {
	return (
		<SessionProvider>
			<LoggedInProvider>
				<AppContextProvider>
					<div className="w-full h-screen">
						<div className="flex">
							<Sidebar />
							<main className="h-screen overflow-auto w-full p-0.5 sm:p-2 md:p-4">
								<div className="h-full">{children}</div>
							</main>
						</div>
					</div>
				</AppContextProvider>
			</LoggedInProvider>
		</SessionProvider>
	);
}
