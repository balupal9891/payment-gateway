import { useState } from 'react';
import {
    Building, Globe, FileText,
    ArrowRight, ArrowLeft, Check, Upload,
    MapPin, ExternalLink, CreditCard, DollarSign, Shield, UserCheck
} from 'lucide-react';

interface FormData {
    businessName: string;
    businessType: string;
    businessAddress: string;
    websiteUrl: string;
    appUrl: string;
    panNumber: string;
    aadhaarNumber: string;
    gstNumber: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    documents: {
        panFile: File | null;
        aadhaarFile: File | null;
        gstCertificate: File | null;
        bankStatement: File | null;
    };
}

interface FormErrors {
    businessName?: string;
    businessType?: string;
    businessAddress?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    panFile?: string;
    aadhaarFile?: string;
    bankStatement?: string;
    websiteUrl?: string;
    appUrl?: string;
    gstNumber?: string;
    gstCertificate?: string;
}

interface TextInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    className?: string;
    icon?: React.ReactNode;
}

interface TextareaInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    required?: boolean;
    error?: string;
    className?: string;
    icon?: React.ReactNode;
}

interface SelectInputProps {
    label: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
}

interface FileUploadProps {
    label: string;
    name: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    accept?: string;
    error?: string;
    icon?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    error,
    className = "",
    icon
}) => {
    return (
        <div className="mb-6 relative">
            <label className="block mb-2 font-medium text-teal-800">
                {label} {required && "*"}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3 text-teal-500">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full p-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? "border-red-500" : "border-teal-200"} ${icon ? 'pl-10' : ''} ${className}`}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

const TextareaInput: React.FC<TextareaInputProps> = ({
    label,
    name,
    value,
    onChange,
    rows = 3,
    required = false,
    error,
    className = "",
    icon
}) => {
    return (
        <div className="mb-6 relative">
            <label className="block mb-2 font-medium text-teal-800">
                {label} {required && "*"}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3 text-teal-500">
                        {icon}
                    </div>
                )}
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    required={required}
                    className={`w-full p-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y ${error ? "border-red-500" : "border-teal-200"} ${icon ? 'pl-10' : ''} ${className}`}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    error,
    icon
}) => {
    return (
        <div className="mb-6 relative">
            <label className="block mb-2 font-medium text-teal-800">
                {label} {required && "*"}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-3 text-teal-500 z-10">
                        {icon}
                    </div>
                )}
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full p-2 border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${error ? "border-red-500" : "border-teal-200"} ${icon ? 'pl-10' : ''}`}
                >
                    <option value="">Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    name,
    file,
    onChange,
    required = false,
    accept = ".pdf,.jpg,.jpeg,.png",
    error,
    icon
}) => {
    return (
        <div className="mb-6">
            <label className="block mb-2 font-medium text-teal-800">
                {label} {required && "*"}
            </label>
            <div
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${file ? "bg-green-50 border-green-400" : "bg-teal-50 border-teal-300"
                    } ${error ? "border-red-500" : ""}`}
            >
                <input
                    type="file"
                    name={name}
                    id={name}
                    onChange={onChange}
                    accept={accept}
                    required={required}
                    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
                />
                <label htmlFor={name} className="flex flex-col items-center cursor-pointer">
                    <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-3">
                        {icon || <Upload size={24} className="text-teal-600" />}
                    </div>
                    <span className="text-teal-600 font-medium">
                        {file ? file.name : `Click to upload ${label}`}
                    </span>
                    <span className="text-gray-600 text-sm mt-1">
                        PDF, JPG, PNG up to 5MB
                    </span>
                </label>
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

const VendorKYCForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        businessType: '',
        businessAddress: '',
        websiteUrl: '',
        appUrl: '',
        panNumber: '',
        aadhaarNumber: '',
        gstNumber: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
        documents: {
            panFile: null,
            aadhaarFile: null,
            gstCertificate: null,
            bankStatement: null
        }
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validation functions
    const validateStep1 = () => {
        const newErrors: FormErrors = {};
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
        if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: FormErrors = {};
        if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
            newErrors.websiteUrl = 'Please enter a valid URL';
        }
        if (formData.appUrl && !isValidUrl(formData.appUrl)) {
            newErrors.appUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: FormErrors = {};
        if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
        else if (!isValidPan(formData.panNumber)) newErrors.panNumber = 'Please enter a valid PAN number';

        if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required';
        else if (!isValidAadhaar(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Please enter a valid Aadhaar number';

        if (formData.gstNumber && !isValidGst(formData.gstNumber)) {
            newErrors.gstNumber = 'Please enter a valid GST number';
        }

        if (!formData.documents.panFile) newErrors.panFile = 'PAN card file is required';
        if (!formData.documents.aadhaarFile) newErrors.aadhaarFile = 'Aadhaar card file is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep4 = () => {
        const newErrors: FormErrors = {};
        if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        else if (!isValidIfsc(formData.ifscCode)) newErrors.ifscCode = 'Please enter a valid IFSC code';

        if (!formData.documents.bankStatement) newErrors.bankStatement = 'Bank statement is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
        return panRegex.test(pan);
    };

    const isValidAadhaar = (aadhaar: string): boolean => {
        const aadhaarRegex = /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/;
        return aadhaarRegex.test(aadhaar);
    };

    const isValidGst = (gst: string): boolean => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const isValidIfsc = (ifsc: string): boolean => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
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
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep4()) {
            alert('KYC Form submitted successfully! Your application is under review.');
            // In a real application, you would send the data to your backend here
        }
    };

    const nextStep = () => {
        let isValid = false;

        switch (step) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
            case 3:
                isValid = validateStep3();
                break;
            default:
                isValid = false;
        }

        if (isValid) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const goToStep = (stepNumber: number) => {
        // Only allow navigation to completed steps or the next step
        if (stepNumber <= step) {
            setStep(stepNumber);
        }
    };

    const stepIcons = [
        { icon: <Building size={20} />, label: "Business", color: "bg-teal-500" },
        { icon: <Globe size={20} />, label: "Website", color: "bg-teal-500" },
        { icon: <FileText size={20} />, label: "Documents", color: "bg-teal-500" },
        { icon: <CreditCard size={20} />, label: "Bank", color: "bg-teal-500" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 py-10 px-4 font-sans relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-teal-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Vendor KYC Verification</h1>
                            <p className="opacity-90">Complete your KYC to activate Payment Gateway FlowWise</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Shield size={32} />
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Progress tracker */}
                    <div className="flex justify-between mb-10 relative">
                        {stepIcons.map((stepIcon, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 relative">
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(i + 1)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 relative z-10 text-white ${step >= i + 1 ? stepIcon.color : 'bg-gray-300'} ${i + 1 <= step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                        disabled={i + 1 > step}
                                    >
                                        {step > i + 1 ? <Check size={24} /> : stepIcon.icon}
                                    </button>
                                    <span className={`text-sm font-medium ${step >= i + 1 ? 'text-gray-800' : 'text-gray-500'}`}>{stepIcon.label}</span>
                                </div>
                                {i < stepIcons.length - 1 && (
                                    <div className={`absolute top-6 left-1/2 right-0 h-1 ${step > i + 1 ? stepIcon.color : 'bg-gray-200'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Business Information */}
                        {step === 1 && (
                            <>
                                <TextInput 
                                    label="Business Name" 
                                    name="businessName" 
                                    value={formData.businessName} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.businessName} 
                                    icon={<Building size={18} />}
                                />
                                <SelectInput
                                    label="Business Type"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    required
                                    error={errors.businessType}
                                    options={[
                                        { value: "soleProprietorship", label: "Sole Proprietorship" },
                                        { value: "partnership", label: "Partnership" },
                                        { value: "llp", label: "LLP" },
                                        { value: "pvtLtd", label: "Private Limited" },
                                        { value: "publicLtd", label: "Public Limited" },
                                        { value: "other", label: "Other" },
                                    ]}
                                    icon={<Building size={18} />}
                                />
                                <TextareaInput 
                                    label="Business Address" 
                                    name="businessAddress" 
                                    value={formData.businessAddress} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.businessAddress} 
                                    icon={<MapPin size={18} />}
                                />
                                <div className="flex justify-end mt-8">
                                    <button type="button" onClick={nextStep} className="flex items-center bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                                        Next <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Website */}
                        {step === 2 && (
                            <>
                                <TextInput 
                                    label="Website URL" 
                                    name="websiteUrl" 
                                    value={formData.websiteUrl} 
                                    onChange={handleInputChange} 
                                    placeholder="https://example.com" 
                                    error={errors.websiteUrl} 
                                    icon={<Globe size={18} />}
                                />
                                <TextInput 
                                    label="App URL" 
                                    name="appUrl" 
                                    value={formData.appUrl} 
                                    onChange={handleInputChange} 
                                    placeholder="https://play.google.com/store/apps/details?id=example" 
                                    error={errors.appUrl} 
                                    icon={<ExternalLink size={18} />}
                                />
                                <div className="flex justify-between mt-8">
                                    <button type="button" onClick={prevStep} className="flex items-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                        <ArrowLeft size={18} className="mr-2" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="flex items-center bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                                        Next <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Documents */}
                        {step === 3 && (
                            <>
                                <TextInput 
                                    label="PAN Number" 
                                    name="panNumber" 
                                    value={formData.panNumber} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.panNumber} 
                                    className="uppercase"
                                    icon={<FileText size={18} />}
                                />
                                <FileUpload 
                                    label="PAN Card" 
                                    name="panFile" 
                                    file={formData.documents.panFile} 
                                    onChange={handleFileChange} 
                                    required 
                                    error={errors.panFile} 
                                    icon={<FileText size={18} />}
                                />
                                <TextInput 
                                    label="Aadhaar Number" 
                                    name="aadhaarNumber" 
                                    value={formData.aadhaarNumber} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.aadhaarNumber}
                                    icon={<UserCheck size={18} />}
                                />
                                <FileUpload 
                                    label="Aadhaar Card" 
                                    name="aadhaarFile" 
                                    file={formData.documents.aadhaarFile} 
                                    onChange={handleFileChange} 
                                    required 
                                    error={errors.aadhaarFile} 
                                    icon={<UserCheck size={18} />}
                                />
                                <TextInput 
                                    label="GST Number" 
                                    name="gstNumber" 
                                    value={formData.gstNumber} 
                                    onChange={handleInputChange} 
                                    error={errors.gstNumber}
                                    icon={<FileText size={18} />}
                                />
                                <FileUpload 
                                    label="GST Certificate" 
                                    name="gstCertificate" 
                                    file={formData.documents.gstCertificate} 
                                    onChange={handleFileChange} 
                                    error={errors.gstCertificate} 
                                    icon={<FileText size={18} />}
                                />
                                <div className="flex justify-between mt-8">
                                    <button type="button" onClick={prevStep} className="flex items-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                        <ArrowLeft size={18} className="mr-2" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="flex items-center bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                                        Next <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Bank */}
                        {step === 4 && (
                            <>
                                <TextInput 
                                    label="Account Holder Name" 
                                    name="accountHolderName" 
                                    value={formData.accountHolderName} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.accountHolderName} 
                                    icon={<UserCheck size={18} />}
                                />
                                <TextInput 
                                    label="Bank Name" 
                                    name="bankName" 
                                    value={formData.bankName} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.bankName} 
                                    icon={<Building size={18} />}
                                />
                                <TextInput 
                                    label="Account Number" 
                                    name="accountNumber" 
                                    value={formData.accountNumber} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.accountNumber} 
                                    icon={<CreditCard size={18} />}
                                />
                                <TextInput 
                                    label="IFSC Code" 
                                    name="ifscCode" 
                                    value={formData.ifscCode} 
                                    onChange={handleInputChange} 
                                    required 
                                    error={errors.ifscCode} 
                                    className="uppercase"
                                    icon={<DollarSign size={18} />}
                                />
                                <FileUpload 
                                    label="Bank Statement" 
                                    name="bankStatement" 
                                    file={formData.documents.bankStatement} 
                                    onChange={handleFileChange} 
                                    required 
                                    error={errors.bankStatement} 
                                    icon={<FileText size={18} />}
                                />
                                <div className="flex justify-between mt-8">
                                    <button type="button" onClick={prevStep} className="flex items-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                        <ArrowLeft size={18} className="mr-2" /> Back
                                    </button>
                                    <button type="submit" className="flex items-center bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                                        Submit KYC <Check size={18} className="ml-2" />
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default VendorKYCForm;