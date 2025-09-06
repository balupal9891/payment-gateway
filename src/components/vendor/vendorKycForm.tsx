import { useState } from 'react';
import {
    Building, Globe, FileText, Check, Upload,
    MapPin, ExternalLink, Shield, UserCheck,
    Briefcase, FileCheck, AlertCircle, CheckCircle2
} from 'lucide-react';

interface FormData {
    businessName: string;
    businessType: string;
    businessNature: string;
    businessAddress: string;
    websiteUrl: string;
    appUrl: string;
    panNumber: string;
    aadhaarNumber: string;
    gstNumber: string;
    documents: {
        [key: string]: File | null;
    };
    submittedDocuments: {
        [key: string]: boolean;
    };
}

interface FormErrors {
    [key: string]: string;
}

interface DocumentConfig {
    key: string;
    label: string;
    icon: React.ReactNode;
    required: boolean;
    accept: string;
    relatedField?: string;
}

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    className?: string;
    icon?: React.ReactNode;
    options?: { value: string; label: string }[];
    rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    error,
    className = "",
    icon,
    options,
    rows
}) => {
    const baseInputClass = `w-full p-2.5 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
        error ? "border-red-500 focus:ring-red-500" : "border-gray-200 hover:border-teal-300"
    } ${icon ? 'pl-10' : ''} ${className}`;

    const renderInput = () => {
        if (options) {
            return (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`${baseInputClass} bg-white cursor-pointer`}
                >
                    <option value="">Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }
        
        if (rows) {
            return (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    required={required}
                    placeholder={placeholder}
                    className={`${baseInputClass} resize-y`}
                />
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={baseInputClass}
            />
        );
    };

    return (
        <div className="mb-4 relative">
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                {label} {required && <span className="text-teal-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3 text-teal-500 z-10">
                        {icon}
                    </div>
                )}
                {renderInput()}
            </div>
            {error && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                    <AlertCircle size={14} className="mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
};

interface DocumentUploadProps {
    config: DocumentConfig;
    file: File | null;
    isSubmitted: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    config,
    file,
    isSubmitted,
    onChange,
    error
}) => {
    if (isSubmitted) {
        return (
            <div className="mb-4">
                <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                    {config.label} {config.required && <span className="text-teal-500">*</span>}
                </label>
                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center text-green-600">
                            <CheckCircle2 size={20} className="mr-3" />
                            <div>
                                <span className="font-medium text-sm">Document Submitted</span>
                                <p className="text-xs text-green-500 mt-1">This document has been successfully uploaded and verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                {config.label} {config.required && <span className="text-teal-500">*</span>}
            </label>
            <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 hover:border-teal-400 ${
                    file 
                        ? "bg-teal-50 border-teal-300" 
                        : "bg-gray-50 border-gray-300 hover:bg-teal-50"
                } ${error ? "border-red-500 bg-red-50" : ""}`}
            >
                <input
                    type="file"
                    name={config.key}
                    id={config.key}
                    onChange={onChange}
                    accept={config.accept}
                    required={config.required}
                    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
                />
                <label htmlFor={config.key} className="flex flex-col items-center cursor-pointer">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-colors ${
                        file ? "bg-teal-100" : "bg-gray-100 hover:bg-teal-100"
                    }`}>
                        {file ? (
                            <CheckCircle2 size={20} className="text-teal-600" />
                        ) : (
                            config.icon || <Upload size={20} className="text-gray-600" />
                        )}
                    </div>
                    <span className={`font-medium mb-2 text-sm ${file ? "text-teal-600" : "text-gray-700"}`}>
                        {file ? file.name : `Upload ${config.label}`}
                    </span>
                    <span className="text-gray-500 text-xs">
                        PDF, JPG, PNG up to 5MB
                    </span>
                    {!file && (
                        <span className="text-teal-500 text-xs mt-1 font-medium">
                            Click to browse files
                        </span>
                    )}
                </label>
            </div>
            {error && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                    <AlertCircle size={14} className="mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
};

const VendorKYCForm = () => {
    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        businessType: '',
        businessNature: '',
        businessAddress: '',
        websiteUrl: '',
        appUrl: '',
        panNumber: '',
        aadhaarNumber: '',
        gstNumber: '',
        documents: {},
        submittedDocuments: {
            panFile: false,
            gstCertificate: false,
        }
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const documentConfigs: DocumentConfig[] = [
        {
            key: 'panFile',
            label: 'PAN Card',
            icon: <FileText size={20} />,
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png',
            relatedField: 'panNumber'
        },
        {
            key: 'aadhaarFile',
            label: 'Aadhaar Card',
            icon: <UserCheck size={20} />,
            required: true,
            accept: '.pdf,.jpg,.jpeg,.png',
            relatedField: 'aadhaarNumber'
        },
        {
            key: 'gstCertificate',
            label: 'GST Certificate',
            icon: <FileCheck size={20} />,
            required: false,
            accept: '.pdf,.jpg,.jpeg,.png',
            relatedField: 'gstNumber'
        }
    ];

    const businessTypes = [
        { value: "soleProprietorship", label: "Sole Proprietorship" },
        { value: "partnership", label: "Partnership" },
        { value: "llp", label: "Limited Liability Partnership (LLP)" },
        { value: "pvtLtd", label: "Private Limited Company" },
        { value: "publicLtd", label: "Public Limited Company" },
        { value: "other", label: "Other" },
    ];

    const businessNatures = [
        { value: "retail", label: "Retail" },
        { value: "wholesale", label: "Wholesale" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "services", label: "Services" },
        { value: "consulting", label: "Consulting" },
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "education", label: "Education" },
        { value: "finance", label: "Finance" },
        { value: "real_estate", label: "Real Estate" },
        { value: "other", label: "Other" },
    ];

    // Helper validation functions
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isValidPan = (pan: string): boolean => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan.toUpperCase());
    };

    const isValidAadhaar = (aadhaar: string): boolean => {
        const cleaned = aadhaar.replace(/\s/g, '');
        const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
        return aadhaarRegex.test(cleaned);
    };

    const isValidGst = (gst: string): boolean => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst.toUpperCase());
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        // Business information validation
        if (!formData.businessName.trim()) 
            newErrors.businessName = 'Business name is required';
        if (!formData.businessType) 
            newErrors.businessType = 'Business type is required';
        if (!formData.businessNature) 
            newErrors.businessNature = 'Business nature is required';
        if (!formData.businessAddress.trim()) 
            newErrors.businessAddress = 'Business address is required';

        // URL validation
        if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
            newErrors.websiteUrl = 'Please enter a valid URL';
        }
        if (formData.appUrl && !isValidUrl(formData.appUrl)) {
            newErrors.appUrl = 'Please enter a valid URL';
        }

        // Document validation
        if (!formData.panNumber.trim()) 
            newErrors.panNumber = 'PAN number is required';
        else if (!isValidPan(formData.panNumber)) 
            newErrors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';

        if (!formData.aadhaarNumber.trim()) 
            newErrors.aadhaarNumber = 'Aadhaar number is required';
        else if (!isValidAadhaar(formData.aadhaarNumber)) 
            newErrors.aadhaarNumber = 'Please enter a valid Aadhaar number';

        if (formData.gstNumber && !isValidGst(formData.gstNumber)) {
            newErrors.gstNumber = 'Please enter a valid GST number';
        }

        // Document files validation
        documentConfigs.forEach(config => {
            const isSubmitted = formData.submittedDocuments[config.key];
            const hasFile = formData.documents[config.key];
            
            if (!isSubmitted && config.required && !hasFile) {
                newErrors[config.key] = `${config.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev: any) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        const file = e.target.files?.[0] || null;

        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [name]: file
            }
        }));

        // Clear error when user selects a file
        if (errors[name]) {
            setErrors((prev: any) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Simulated form submission - replace with actual API call
            console.log('Form submitted successfully:', formData);
            alert('KYC Form submitted successfully! Your application is under review.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-6 px-4 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Vendor KYC Portal</h1>
                            <p className="text-teal-100">Complete your verification to activate FlowWise Payment Gateway</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Shield size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Business Information Section */}
                        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                                <Building className="mr-2 text-teal-500" size={24} />
                                Business Information
                            </h2>
                            <p className="text-gray-600 text-sm">Tell us about your business</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Business Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                required
                                error={errors.businessName}
                                icon={<Building size={16} />}
                                placeholder="Enter your registered business name"
                            />

                            <InputField
                                label="Business Type"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                required
                                error={errors.businessType}
                                options={businessTypes}
                                icon={<Briefcase size={16} />}
                            />

                            <InputField
                                label="Business Nature"
                                name="businessNature"
                                value={formData.businessNature}
                                onChange={handleInputChange}
                                required
                                error={errors.businessNature}
                                options={businessNatures}
                                icon={<Briefcase size={16} />}
                            />
                        </div>

                        <InputField
                            label="Business Address"
                            name="businessAddress"
                            value={formData.businessAddress}
                            onChange={handleInputChange}
                            required
                            error={errors.businessAddress}
                            icon={<MapPin size={16} />}
                            rows={3}
                            placeholder="Enter complete business address with pincode"
                        />

                        {/* Online Presence Section */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                                <Globe className="mr-2 text-blue-500" size={24} />
                                Online Presence
                            </h2>
                            <p className="text-gray-600 text-sm">Share your website and app details (optional)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Website URL"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleInputChange}
                                error={errors.websiteUrl}
                                icon={<Globe size={16} />}
                                placeholder="https://your-website.com"
                            />

                            <InputField
                                label="Mobile App URL"
                                name="appUrl"
                                value={formData.appUrl}
                                onChange={handleInputChange}
                                error={errors.appUrl}
                                icon={<ExternalLink size={16} />}
                                placeholder="https://play.google.com/store/apps/details?id=your-app"
                            />
                        </div>

                        {/* Document Information Section */}
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                                <FileText className="mr-2 text-amber-500" size={24} />
                                Document Information
                            </h2>
                            <p className="text-gray-600 text-sm">Provide your document details and upload files</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="PAN Number"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                required
                                error={errors.panNumber}
                                icon={<FileText size={16} />}
                                placeholder="ABCDE1234F"
                                className="uppercase"
                            />

                            <InputField
                                label="Aadhaar Number"
                                name="aadhaarNumber"
                                value={formData.aadhaarNumber}
                                onChange={handleInputChange}
                                required
                                error={errors.aadhaarNumber}
                                icon={<UserCheck size={16} />}
                                placeholder="1234 5678 9012"
                            />

                            <div className="md:col-span-1">
                                <InputField
                                    label="GST Number"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    error={errors.gstNumber}
                                    icon={<FileCheck size={16} />}
                                    placeholder="22ABCDE1234F1Z5 (Optional)"
                                    className="uppercase"
                                />
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                                <Upload className="mr-2 text-purple-500" size={24} />
                                Document Upload
                            </h2>
                            <p className="text-gray-600 text-sm">Upload required documents for verification</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documentConfigs.map(config => (
                                <DocumentUpload
                                    key={config.key}
                                    config={config}
                                    file={formData.documents[config.key]}
                                    isSubmitted={formData.submittedDocuments[config.key]}
                                    onChange={handleFileChange}
                                    error={errors[config.key]}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Submit KYC Application <Check size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                            <Shield size={16} className="mr-2 text-teal-500" />
                            <span>Your data is encrypted and secure</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>Need help? Contact support</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorKYCForm;