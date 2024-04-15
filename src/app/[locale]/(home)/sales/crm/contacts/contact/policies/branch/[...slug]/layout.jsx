import NotFound from '@/app/[locale]/not-found';
import ContactDetails from '../../../[id]/ContactDetails';
import BranchDetails from './BranchDetails';

const wait3seconds = () => {
	console.log('entre');
	return new Promise((resolve) => setTimeout(resolve, 3000));
};
export default async function PoliciesLayout({ params: { slug }, children }) {
	await wait3seconds();
	const [ branch, id ] = slug;
	if (!branch || !id) return <NotFound />;

	if (branch)
		return (
			<div>
				<ContactDetails contactInfo={null} id={id} />
				<BranchDetails id={id} branch={branch}/>
			</div>
		);
}
