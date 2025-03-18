import { Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'

function UploadProfilePicture({ image, setImage }) {
	const [images, setImages] = useState([])

	const onChange = ({ fileList: newFileList }) => {
		setImages(newFileList)
	}

	const onPreview = async file => {
		let src = file.url || file.preview // Use preview if available
		if (!src) {
			src = image // Use cropped Base64 image
		}

		const image = new Image()
		image.src = src
		const imgWindow = window.open(src)
		imgWindow.document.write(image.outerHTML)
	}

	// Convert cropped image to Base64 and update fileList
	const beforeUpload = async file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				setImage(reader.result) // Store cropped Base64 string

				// Update fileList with Base64 preview
				setImages([
					{
						uid: file.uid,
						name: file.name,
						status: 'done',
						url: image, // Store Base64 as file URL
						preview: image, // Store preview for onPreview
						originFileObj: file,
					},
				])

				resolve(false) // Prevent auto-upload
			}
			reader.onerror = error => reject(error)
		})
	}

	const deleteImage = () => {
		setImage(null)
		setImages([])
	}

	return image ? (
		<div className='w-[20%] relative rounded-full'>
			<img
				className='w-full object-contain rounded-full ring-1 p-1'
				src={image}
				alt='profile-picture'
			/>
			<button
				type='button'
				onClick={deleteImage}
				className='absolute right-0 bg-blue-300 p-1 rounded-full border -bottom-2 cursor-pointer -translate-y-1/2'
			>
				<FaRegTrashAlt />
			</button>
		</div>
	) : (
		<ImgCrop rotationSlider zoomSlider>
			<Upload
				listType='picture-circle'
				fileList={images}
				onChange={onChange}
				onPreview={onPreview}
				beforeUpload={beforeUpload}
			>
				{images.length < 1 && (
					<span className='text-[12px] p-2 text-white'>
						+ Upload Profile Picture
					</span>
				)}
			</Upload>
		</ImgCrop>
	)
}

export default UploadProfilePicture
