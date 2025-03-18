import '@ant-design/v5-patch-for-react-19'
import { Modal } from 'antd'
import {
	useSendOtpMutation,
	useVerifyOtpMutation,
} from '../../../redux/apiSlices/user/authApiSlice'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import UploadProfilePicture from '../auth/UploadProfilePicture'
import { MdVerifiedUser } from 'react-icons/md'
import { PiSpinnerGapLight } from 'react-icons/pi'
import moment from 'moment'
import { setUserdata } from '../../../redux/slices/user/userSlice'
import { toast } from 'react-toastify'
import { useEditProfileMutation } from '../../../redux/apiSlices/user/profileApiSlice'

function EditForm({ user, isModalOpen, setIsModalOpen }) {
	const [editProfile, { isLoading }] = useEditProfileMutation()
	const [sendOTP, { isLoading: generating }] = useSendOtpMutation()
	const [verifyOTP, { isLoading: verifying }] = useVerifyOtpMutation()

	const [emailVerified, setEmailVerified] = useState(false)
	const [image, setImage] = useState(user.avatar)
	const [otp, setOtp] = useState('')

	const dispatch = useDispatch()

	const formik = useFormik({
		initialValues: {
			username: user.username,
			email: user.email,
			mobile: user.mobile,
			DOB: user.DOB,
			gender: user.gender,
			address: user.address,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			username: Yup.string().min(3).required(),
			email: Yup.string()
				.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is not valid')
				.email('Invalid Email Address')
				.required(),
			mobile: Yup.string()
				.required('mobile number is required')
				.matches(
					/^(?:(\s*[\-]\s*)?|[0]?)?[6-9]\d{9}$/,
					'mobile number is not valid'
				),
			gender: Yup.string().required('Please select a gender'),
			DOB: Yup.string().required('Please choose your Date of Birth'),
			address: Yup.string().required('Please provide an address'),
		}),

		onSubmit: async values => {
			if (emailVerified !== true && formik.values.email !== user.email)
				return toast.warn('Please Verify Your Email')
			if (!image) return toast.warn('Please upload a profile picture')
			try {
				const { data } = await editProfile({
					...values,
					avatar: image,
					id: user._id,
				})
				if (data?.success) {
					dispatch(setUserdata(data.user))
					formik.resetForm()
					toast.success(data.message)
					setIsModalOpen(false)
				} else {
					toast.error(data.message)
				}
			} catch (error) {
				console.error(error)
			}
		},
	})

	const generateOTP = async () => {
		try {
			if (!formik.errors.email) {
				const { data } = await sendOTP({ email: formik.values.email })
				if (data.success) {
					setEmailVerified('sent')
					toast.success(data.message)
				} else {
					toast.error(data.message)
				}
			} else toast.error('Enter a Valid Email')
		} catch (error) {
			console.error(error)
		}
	}

	const handleVerifyOTP = async () => {
		try {
			const { data } = await verifyOTP({ otp, email: formik.values.email })
			if (data.success) {
				setEmailVerified(true)
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			console.error(error)
			toast.error('Internal Server Error')
		}
	}

	const handleCancel = () => {
		formik.resetForm()
		setIsModalOpen(false)
	}

	function areObjectsEqual(obj1, obj2) {
		const commonKeys = Object.keys(obj1) // Only consider keys from obj1

		return commonKeys.every(key => {
			if (!obj2.hasOwnProperty(key)) return false // Ensure obj2 has the key

			// Handle nested objects (deep comparison)
			if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
				return JSON.stringify(obj1[key]) === JSON.stringify(obj2[key]) // Quick deep comparison
			}

			return obj1[key] === obj2[key] // Compare primitive values
		})
	}

	return (
		<Modal
			title='Edit Profile'
			open={isModalOpen}
			onCancel={handleCancel}
			footer={[]}
			className='bg-blue-800 rounded-lg'
		>
			<form
				className='flex flex-col gap-4 w-full'
				onSubmit={formik.handleSubmit}
			>
				<div className='flex gap-2 w-full'>
					<UploadProfilePicture image={image} setImage={setImage} />
					<div className='group w-[80%] relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
						<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
							Username
						</label>
						<input
							type='text'
							name='username'
							onChange={formik.handleChange}
							value={formik.values.username}
							placeholder='Enter Your Username'
							autoComplete='off'
							className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
						/>
						<p className='text-xs font-thin text-red-500'>
							{formik.touched.username && formik?.errors?.username}
						</p>
					</div>
				</div>
				<div className='group relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
					<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
						{emailVerified === 'sent' ? 'Enter OTP' : 'Email'}
					</label>
					<div className='flex justify-center items-center gap-3'>
						<input
							type='email'
							name='email'
							onChange={
								emailVerified === 'sent'
									? e => setOtp(e.target.value)
									: formik.handleChange
							}
							value={emailVerified === 'sent' ? otp : formik.values.email}
							placeholder={
								emailVerified === 'sent'
									? 'Please enter your OTP before expiring'
									: 'Enter Your Email Address'
							}
							autoComplete='off'
							className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
						/>
						{emailVerified === true && formik.values.email !== user.email && (
							<MdVerifiedUser className='text-green-500' />
						)}
						{emailVerified === false && formik.values.email !== user.email && (
							<button
								type='button'
								disabled={generating}
								onClick={generateOTP}
								className='ring cursor-pointer rounded text-xs p-1'
							>
								{generating ? (
									<PiSpinnerGapLight className='animate-spin m-auto' />
								) : (
									'Get..OTP'
								)}
							</button>
						)}
						{emailVerified === 'sent' && formik.values.email !== user.email && (
							<button
								type='button'
								disabled={verifying}
								onClick={handleVerifyOTP}
								className='ring cursor-pointer animate-pulse bg-white text-black rounded text-xs p-1'
							>
								{verifying ? (
									<PiSpinnerGapLight className='animate-spin m-auto' />
								) : (
									'Verify'
								)}
							</button>
						)}
					</div>
					<p className='text-xs font-thin text-red-500'>
						{formik.touched.email && formik?.errors?.email}
					</p>
				</div>
				<div className='group relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
					<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
						Contact Number
					</label>
					<div className='flex gap-2 items-center'>
						<span className='text-sm text-gray-400'>+91</span>
						<input
							type='mobile'
							name='mobile'
							onChange={formik.handleChange}
							value={formik.values.mobile}
							placeholder='Enter Your Phone Number'
							autoComplete='off'
							className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
						/>
					</div>
					<p className='text-xs font-thin text-red-500'>
						{formik.touched.mobile && formik?.errors?.mobile}
					</p>
				</div>
				<div className='group relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
					<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
						Gender
					</label>
					<div className='flex text-gray-400 justify-between p-1'>
						<label className='flex cursor-pointer justify-center items-center gap-2 text-sm'>
							<input
								type='radio'
								onChange={formik.handleChange}
								checked={formik.values.gender === 'Male'}
								name='gender'
								value='Male'
							/>
							Male
						</label>
						<label className='flex cursor-pointer justify-center items-center gap-2 text-sm'>
							<input
								type='radio'
								onChange={formik.handleChange}
								checked={formik.values.gender === 'Female'}
								name='gender'
								value='Female'
							/>
							Female
						</label>
						<label className='flex cursor-pointer justify-center items-center gap-2 text-sm'>
							<input
								type='radio'
								onChange={formik.handleChange}
								checked={formik.values.gender === 'Others'}
								name='gender'
								value='Others'
							/>
							Others
						</label>
					</div>
					<p className='text-xs font-thin text-red-500'>
						{formik.touched.gender && formik?.errors?.gender}
					</p>
				</div>
				<div className='group relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
					<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
						Date Of Birth
					</label>
					<input
						className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
						type='date'
						name='DOB'
						onChange={formik.handleChange}
						value={moment(formik.values.DOB).format('YYYY-MM-DD')}
						autoComplete='off'
						placeholder='Please Choose Your Date of Birth'
					/>
					<p className='text-xs font-thin text-red-500'>
						{formik.touched.DOB && formik?.errors?.DOB}
					</p>
				</div>

				<div className='group relative rounded-lg border focus-within:border-sky-500 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
					<label className='text-xs font-medium text-muted-foreground group-focus-within:text-sky-300 text-gray-400'>
						Address
					</label>
					<textarea
						type='text'
						name='address'
						onChange={formik.handleChange}
						value={formik.values.address}
						placeholder='Enter Your Full Address'
						autoComplete='off'
						className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
					/>
					<p className='text-xs font-thin text-red-500'>
						{formik.touched.address && formik?.errors?.address}
					</p>
				</div>

				<button
					className='font-semibold hover:bg-black hover:text-white hover:ring cursor-pointer hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-400 text-black h-10 px-4 py-2'
					type='submit'
					disabled={
						isLoading ||
						(areObjectsEqual(formik.values, user) && image === user.avatar)
					}
				>
					{isLoading ? (
						<PiSpinnerGapLight className='animate-spin m-auto' />
					) : (
						'Save'
					)}
				</button>
			</form>
		</Modal>
	)
}

export default EditForm
