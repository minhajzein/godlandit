import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
	return (
		<div className='w-full p-5'>
			Welcome To Home{' '}
			<Link to='/profile' className='underline text-blue-500'>
				See Your Profile
			</Link>
		</div>
	)
}

export default Home
