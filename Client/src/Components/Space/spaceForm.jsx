import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const SpaceForm = () => {
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.object().shape({
      type: Yup.string().required('Location type is required'),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zone: Yup.string().required('Zone is required')
    }),
    spaceType: Yup.string()
      .oneOf(['building_facade', 'mall_interior', 'billboard', 'public_transport', 'other'], 'Invalid space type')
      .required('Space type is required'),
    dimensions: Yup.object().shape({
      width: Yup.number().positive('Width must be a positive number').required('Width is required'),
      height: Yup.number().positive('Height must be a positive number').required('Height is required')
    }),
    isScreenInstalled: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: {
        type: '',
        street: '',
        city: '',
        zone: ''
      },
      spaceType: '',
      dimensions: {
        width: '',
        height: ''
      },
      isScreenInstalled: false
    },
    validationSchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });

  const handleFormSubmit = async () => {
    if (uploadedFiles.length === 0) {
      Swal.fire({
        title: 'Missing Images',
        text: 'Please upload at least one image of the space',
        icon: 'warning',
        confirmButtonColor: '#FDB827'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', formik.values.title);
      formData.append('description', formik.values.description);
      formData.append('location', JSON.stringify(formik.values.location));
      formData.append('spaceType', formik.values.spaceType);
      formData.append('dimensions', JSON.stringify(formik.values.dimensions));
      formData.append('isScreenInstalled', formik.values.isScreenInstalled);

      // Add all images to form data
      uploadedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('http://localhost:8000/api/spaces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Space added successfully',
          icon: 'success',
          confirmButtonColor: '#FDB827'
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      console.error('Error creating space:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error occurred while adding the space',
        icon: 'error',
        confirmButtonColor: '#FDB827'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      Swal.fire({
        title: 'Too Many Images',
        text: 'You can upload a maximum of 5 images',
        icon: 'warning',
        confirmButtonColor: '#FDB827'
      });
      return;
    }
    setUploadedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const validateCurrentStep = () => {
    let isValid = true;
    let errors = {};

    // Validate based on current step
    if (currentStep === 1) {
      if (!formik.values.title) {
        errors.title = 'Title is required';
        isValid = false;
      }
      if (!formik.values.description) {
        errors.description = 'Description is required';
        isValid = false;
      }
    } else if (currentStep === 2) {
      const locationFields = ['type', 'street', 'city', 'zone'];
      locationFields.forEach(field => {
        if (!formik.values.location[field]) {
          errors[`location.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          isValid = false;
        }
      });
    } else if (currentStep === 3) {
      if (!formik.values.spaceType) {
        errors.spaceType = 'Space type is required';
        isValid = false;
      }
      if (!formik.values.dimensions.width) {
        errors['dimensions.width'] = 'Width is required';
        isValid = false;
      }
      if (!formik.values.dimensions.height) {
        errors['dimensions.height'] = 'Height is required';
        isValid = false;
      }
    }

    // Set errors if any
    if (!isValid) {
      Object.keys(errors).forEach(key => {
        formik.setFieldError(key, errors[key]);
        formik.setFieldTouched(key, true, false);
      });
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  // Render the form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Space Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Location Information</h2>
            {[
              { field: 'type', label: 'Location Type' },
              { field: 'street', label: 'Street' },
              { field: 'city', label: 'City' },
              { field: 'zone', label: 'Zone' }
            ].map(({ field, label }) => (
              <div key={field}>
                <label htmlFor={`location.${field}`} className="block text-sm font-medium text-gray-700">
                  {label} *
                </label>
                <input
                  type="text"
                  id={`location.${field}`}
                  name={`location.${field}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location[field]}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
                />
                {formik.touched.location?.[field] && formik.errors.location?.[field] && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.location[field]}</div>
                )}
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Space Details</h2>
            <div>
              <label htmlFor="spaceType" className="block text-sm font-medium text-gray-700">Space Type *</label>
              <select
                id="spaceType"
                name="spaceType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.spaceType}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
              >
                <option value="">Select Space Type</option>
                <option value="building_facade">Building Facade</option>
                <option value="mall_interior">Mall Interior</option>
                <option value="billboard">Billboard</option>
                <option value="public_transport">Public Transport</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.spaceType && formik.errors.spaceType && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.spaceType}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { dim: 'width', label: 'Width (meters)' },
                { dim: 'height', label: 'Height (meters)' }
              ].map(({ dim, label }) => (
                <div key={dim}>
                  <label htmlFor={`dimensions.${dim}`} className="block text-sm font-medium text-gray-700">
                    {label} *
                  </label>
                  <input
                    type="number"
                    id={`dimensions.${dim}`}
                    name={`dimensions.${dim}`}
                    step="0.01"
                    min="0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dimensions[dim]}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
                  />
                  {formik.touched.dimensions?.[dim] && formik.errors.dimensions?.[dim] && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.dimensions[dim]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isScreenInstalled"
                name="isScreenInstalled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.isScreenInstalled}
                className="h-5 w-5 text-[#FDB827] focus:ring-[#FDB827] border-gray-300 rounded"
              />
              <label htmlFor="isScreenInstalled" className="ml-3 block text-sm text-gray-700">Screen already installed</label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Upload Images</h2>
            <p className="text-sm text-gray-500">Upload up to 5 images of the advertising space <span className="text-red-500">*</span></p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FDB827] file:text-black hover:file:bg-[#F26B0F]/90"
            />
            {uploadedFiles.length === 0 && (
              <div className="text-red-500 text-sm mt-1">Please upload at least one image</div>
            )}
            {imagePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index+1}`} className="h-24 w-24 object-cover rounded-lg border border-gray-300" />
                    <span className="absolute top-0 right-0 bg-[#FDB827] text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">{index+1}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-gray-700">Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                <p><strong>Title:</strong> {formik.values.title}</p>
                <p><strong>Space Type:</strong> {formik.values.spaceType ? formik.values.spaceType.replace('_', ' ') : '-'}</p>
                <p><strong>Location:</strong> {formik.values.location.city}, {formik.values.location.zone}</p>
                <p><strong>Dimensions:</strong> {formik.values.dimensions.width} × {formik.values.dimensions.height} meters</p>
                <p><strong>Screen Installed:</strong> {formik.values.isScreenInstalled ? 'Yes' : 'No'}</p>
                <p><strong>Images:</strong> {uploadedFiles.length} uploaded</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Advertising Space</h1>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step < currentStep ? 'bg-[#FDB827] text-white' : 
                    step === currentStep ? 'bg-white text-[#FDB827] border-2 border-[#FDB827]' : 
                    'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {step === 1 ? 'Basic' : 
                   step === 2 ? 'Location' : 
                   step === 3 ? 'Details' : 'Images'}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#FDB827]" 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-[#FDB827] text-black rounded-md hover:bg-[#F26B0F]/90 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFormSubmit}
                className={`px-4 py-2 rounded-md font-medium text-black transition-colors ${
                  isSubmitting ? "bg-gray-400" : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Submit Space'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceForm;