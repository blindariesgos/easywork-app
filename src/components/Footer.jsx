'use client';

export default function Footer() {

	return (
		<div className="mt-2 w-full flex justify-center">
            <ul className="flex w-96 justify-between ml-5 max-md:hidden text-xs">
                <li className="cursor-pointer">© 2024 Easywork</li>
                <span>|</span>
                <li className="cursor-pointer">Soporte Easy</li>
                <span>|</span>
                <li className="cursor-pointer">Temas</li>
            </ul>
		</div>
	);
}
