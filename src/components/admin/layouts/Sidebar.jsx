import { useState } from 'react'
import {
	FcConferenceCall,
	FcDataConfiguration,
	FcHome,
	FcQuestions,
} from 'react-icons/fc'
import {
	IoIosArrowDropleftCircle,
	IoIosArrowDroprightCircle,
} from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'

const SidebarData = [
	{
		name: 'Dashboard',
		icon: FcHome,
		path: '/admin/',
		color: 'bg-gray-500',
	},
	{
		name: 'Users',
		icon: FcConferenceCall,
		path: '/admin/users',
		color: 'bg-red-500',
	},
]

function Sidebar() {
	const [isOpen, setIsOpen] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()

	const isActive = path => location.pathname === path

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div
			className={`h-dvh transition-all duration-300 ${
				isOpen ? 'md:w-52 w-14' : 'w-14'
			} text-white md:flex flex-col justify-between opacity-90 bg-blue-900 hidden`}
		>
			<div className='flex flex-col'>
				<div className='flex items-center justify-center p-2 md:p-4'>
					{isOpen ? (
						<div
							className={`flex items-center gap-3 font-mono transition-all duration-300 font-extrabold  ${
								isOpen ? 'opacity-100 hidden md:block' : 'opacity-0'
							}`}
						>
							<div className='text-foreground font-semibold text-xl tracking-tighter mx-auto flex p-3 items-center gap-2'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth='1.5'
									stroke='currentColor'
									className='w-6 h-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5'
									/>
								</svg>
								GodLandit
							</div>
						</div>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='w-6 h-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5'
							/>
						</svg>
					)}
				</div>
				<div className='flex flex-col mt-16 gap-4'>
					{SidebarData.map((data, i) => {
						const Icon = data.icon
						const itemColor = isActive(data.path)
							? 'md:rounded-md rounded-tl-md rounded-bl-md bg-gray-50'
							: 'hover:bg-gray-100 text-gray-800 md:rounded-md'
						const iconColor = isActive(data.path) ? 'text-gray-900' : ''

						return (
							<div
								key={i}
								className={`transition  duration-300 ease-in-out md:mx-2 py-[2px]`}
							>
								<div
									onClick={() => navigate(data.path)}
									className={`flex justify-between items-center cursor-pointer p-2 text-white hover:text-gray-700 ${itemColor}`}
								>
									<div
										className={`flex gap-3 text-sm font-medium items-center `}
									>
										<Icon className={`size-5 ${iconColor}`} />
										{isOpen && (
											<div className={`${iconColor} hidden md:block`}>
												{data.name}
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className='p-3 hidden md:block'>
				<div className='flex items-center justify-end'>
					{isOpen && (
						<div className='text-[.6rem] font-thin flex justify-end w-full mr-5'>
							Godlandit version 1.0
						</div>
					)}

					<button
						onClick={toggleSidebar}
						className='ml-auto text-[.6rem] cursor-pointer text-gray-200 p-2'
					>
						{isOpen ? (
							<IoIosArrowDropleftCircle className='h-5 w-5' />
						) : (
							<IoIosArrowDroprightCircle className='h-5 w-5' />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
