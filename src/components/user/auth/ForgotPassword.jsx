import { Link, useNavigate } from 'react-router-dom'
import {
	useResetPasswordMutation,
	useSendOtpMutation,
	useVerifyOtpMutation,
} from '../../../redux/apiSlices/user/authApiSlice'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { setCredentials } from '../../../redux/slices/user/authSlice'
import { setUserdata } from '../../../redux/slices/user/userSlice'
import { toast } from 'react-toastify'
import { MdVerifiedUser } from 'react-icons/md'
import { PiSpinnerGapLight } from 'react-icons/pi'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

function ForgotPassword() {
	const [resetPassword, { isLoading }] = useResetPasswordMutation()
	const [sendOTP, { isLoading: generating }] = useSendOtpMutation()
	const [verifyOTP, { isLoading: verifying }] = useVerifyOtpMutation()

	const [isShow, setIsShow] = useState(false)
	const [emailVerified, setEmailVerified] = useState(false)
	const [otp, setOtp] = useState('')

	const navigate = useNavigate()

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is not valid')
				.email('Invalid Email Address')
				.required(),
			password: Yup.string()
				.min(8, 'Password should be atleast 8 character')
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
					'password should contain an uppercase,a lowercase, a number and a special character'
				)
				.required('Password is required'),
			confirmPassword: Yup.string()
				.required('Please confirm your password')
				.oneOf([Yup.ref('password')], 'Password must be same'),
		}),

		onSubmit: async user => {
			if (emailVerified !== true) return toast.warn('Please Verify Your Email')
			try {
				const { data } = await resetPassword(user)
				if (data.success) {
					toast.success(data.message)
					navigate('/login')
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
		}
	}

	return (
		<div className='bg-blue-900 pb-20 text-white flex min-h-screen flex-col items-center sm:justify-center sm:pt-0'>
			<div className='text-foreground font-semibold text-2xl tracking-tighter mx-auto flex pt-10 items-center gap-2'>
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
				GodLandit InfoTech
			</div>
			<div className='relative  mt-12 w-full max-w-xl sm:mt-10'>
				<div className='mx-5 bg-blue-950 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-2xl shadow-slate-500/10 dark:shadow-white/70 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none'>
					<div className='flex flex-col p-6'>
						<h3 className='text-xl font-semibold leading-6 tracking-tighter'>
							Reset Password
						</h3>
						<p className='mt-1.5 text-sm font-medium text-white/50'>
							Verify your email! And reset your password.{' '}
						</p>
					</div>
					<div className='p-6 pt-0 w-full'>
						<form
							className='flex flex-col gap-4 w-full'
							onSubmit={formik.handleSubmit}
						>
							<div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
								<label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
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
									{emailVerified === true && (
										<MdVerifiedUser className='text-green-500' />
									)}
									{emailVerified === false && (
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
									{emailVerified === 'sent' && (
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
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
									<label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
										New Password
									</label>
									<div className='flex justify-between items-center gap-2'>
										<input
											className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground'
											type={isShow ? 'text' : 'password'}
											name='password'
											onChange={formik.handleChange}
											value={formik.values.password}
											placeholder='Enter your new password'
											autoComplete='off'
										/>
										{isShow ? (
											<FaRegEyeSlash
												className='cursor-pointer'
												onClick={() => setIsShow(false)}
											/>
										) : (
											<FaRegEye
												className='cursor-pointer'
												onClick={() => setIsShow(true)}
											/>
										)}
									</div>
									<p className='text-xs font-thin text-red-500'>
										{formik.touched.password && formik?.errors?.password}
									</p>
								</div>
								<div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
									<label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
										Confirm Your Password
									</label>
									<input
										className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground'
										type='password'
										name='confirmPassword'
										onChange={formik.handleChange}
										value={formik.values.confirmPassword}
										placeholder='Re-enter your password'
									/>
									<p className='text-xs font-thin text-red-500'>
										{formik.touched.confirmPassword &&
											formik?.errors?.confirmPassword}
									</p>
								</div>
							</div>
							<button
								className='font-semibold hover:bg-black hover:text-white hover:ring cursor-pointer hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
								type='submit'
								disabled={isLoading}
							>
								{isLoading ? (
									<PiSpinnerGapLight className='animate-spin m-auto' />
								) : (
									'Reset Password'
								)}
							</button>
						</form>
						<div className='mt-4 flex justify-end'>
							<Link className='text-xs underline' to='/login'>
								Back To Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ForgotPassword
