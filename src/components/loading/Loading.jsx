import { PiSpinnerGapLight } from 'react-icons/pi'

function Loading() {
	return (
		<div className='w-full bg-blue-950 h-dvh flex'>
			<PiSpinnerGapLight className='animate-spin text-5xl text-white m-auto' />
		</div>
	)
}

export default Loading
