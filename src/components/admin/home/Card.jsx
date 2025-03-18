function Card({ Icon, count, title }) {
	return (
		<div className='bg-blue-500 rounded-xl gap-1 text-white pt-16 p-5 flex flex-col justify-end items-center'>
			<Icon className='text-6xl' />
			<h1 className='text-xl font-semibold'>{count}</h1>
			<h3 className='capitalize'>{title}</h3>
		</div>
	)
}

export default Card
