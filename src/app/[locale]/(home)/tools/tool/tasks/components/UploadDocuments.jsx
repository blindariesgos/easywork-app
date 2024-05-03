'use client';
import React, { useRef } from 'react';
import CardFile from './CardFile';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { FaDropbox, FaGoogle } from 'react-icons/fa6';

export default function UploadDocuments({ files, deleteFiles, setFiles }) {
	const { t } = useTranslation();
	const inputFileRef = useRef();

	const handleFilesUpload = (event) => {
		let uploadedImages = [ ...files ];
		const fileList = event.target.files;

		if (fileList) {
			for (let i = 0; i < fileList.length; i++) {
				const file = fileList[i];
				// if (file.size > 5 * 1024 * 1024) {
				//     toast.error(t('common:validations:size', { size: 5 }));
				//     return;
				// } else {
				const reader = new FileReader();

				reader.onload = (e) => {
					setTimeout(() => {
						const existFile = uploadedImages.some((item) => item.name === file.name);
						if (!existFile) {
							uploadedImages = [
								...uploadedImages,
								{
									base64: reader.result,
									type:
										file.type.split('/')[0] !== 'application'
											? file.type.split('/')[0]
											: file.type.split('/')[1],
									name: file.name,
									file: file
								}
							];
							setFiles(uploadedImages);
						}
					}, 500);
					inputFileRef.current.value = ''; // resetear el valor del input file
				};
				reader.readAsDataURL(file);
			}
			// }
		}
	};
	return (
		<div>
			<div className="flex flex-wrap gap-3 my-2 mt-4">
				{files.length > 0 &&
					files.map((file, i) => (
						<div key={i}>
							<CardFile data={file} onClick={() => deleteFiles(i)} />
						</div>
					))}
			</div>
			<hr className="text-gray-200 border border-dashed" />
			<div className="text flex text-xs leading-6 text-gray-600 justify-start mt-4 gap-4 flex-wrap">
				<div className="">
					<label
						htmlFor="file-upload"
						className="cursor-pointer flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md"
					>
						<ArrowUpTrayIcon className="text-blue-100 w-8 h-8 " />
						<input
							type="file"
							accept=""
							onChange={(event) => handleFilesUpload(event)}
							id="file-upload"
							className="sr-only outline-none focus:ring-0"
							multiple
							ref={inputFileRef}
						/>
						<p className="text-xs text-black mt-4">{t('tools:tasks:new:upload')}</p>
					</label>
				</div>
				<div className="">
					<div className="cursor-pointer flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
						<Image
							width={200}
							height={200}
							className="h-8 w-auto"
							src="/img/Layer_1.png"
							alt="Your Company"
						/>
						<p className="text-xs text-black mt-4">{t('tools:tasks:new:drive')}</p>
					</div>
				</div>
				<div className="">
					<div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
						<FaGoogle className="text-gray-200 w-8 h-8 " />
						<p className="text-xs text-black mt-4">{t('tools:tasks:new:google')}</p>
					</div>
				</div>
				<div className="">
					<div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
						<Image
							width={200}
							height={200}
							className="h-8 w-auto"
							src="/img/office365.svg"
							alt="Your Company"
						/>
						<p className="text-xs text-black mt-4">{t('tools:tasks:new:office')}</p>
					</div>
				</div>
				<div className="">
					<div className="flex flex-col items-center justify-center h-28 w-24 bg-white rounded-md shadow hover:drop-shadow-md">
						<FaDropbox className="text-gray-200 w-8 h-8 " />
						<p className="text-xs text-black mt-4">{t('tools:tasks:new:dropbox')}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
