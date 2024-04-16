import NotFound from '@/app/[locale]/not-found';
import React from 'react';
import PolicyDetails from './PolicyDetails';
import ContactDetails from '../../[id]/ContactDetails';
import PoliciesDetails from '../../policies/[id]/PoliciesDetails';

export default async function PolicyIdLayout({ params: { slug }, children }) {
	const [ opt, id ] = slug;
	// 	const searchParams = useSearchParams();
	// 	const params = new URLSearchParams(searchParams);
	// 	const pathname = usePathname();
	// 	const { replace } = useRoute();

	//   useEffect(() => {
	//     if (Number(params.get('page')) === 0 || !params.get('page')) {
	//       params.set('page', 1);
	//       replace(`${pathname}?${params.toString()}`);
	//     }
	//   }, [])
	if (!opt || !id) return <NotFound />;

	if (opt)
		return (
			<div className='w-full'>
				{/* <ContactDetails id={id} contactInfo={null}/>
				<PoliciesDetails id={id}/> */}
				<PolicyDetails opt={opt} id={id} />
			</div>
		);
}
