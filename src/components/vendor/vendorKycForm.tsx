import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, AlertCircle, CheckCircle, Building, FileText, CreditCard, Globe, Phone, X, User, Shield, ArrowRight, Info, HelpCircle } from 'lucide-react';
import baseURL, { verfifyUrl } from '../../API/baseUrl';
import { useUser } from '../../store/slices/userSlice';
import ToastContainer from '../../utils/ToastContainer';
import { useToast } from '../../store/slices/toastSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';


// Type definitions (unchanged from your code)
interface Director {
    din: string;
    name: string;
    dob: string;
    designation: string;
    address: string;
}

interface Documents {
    pan: File | null;
    boardResolution: File | null;
    cinCertificate: File | null;
    aoa: File | null;
    moa: File | null;
    bankCheque: File | null;
}

interface FormData {
    // Step 1: PAN Details
    panNumber: string;
    panName: string;
    // dob: string;
    panVerified: boolean;
    panResponse: any;

    // Step 2: GST Details
    gstNumber: string;
    businessName: string;
    gstVerified: boolean;
    gstResponse: any;
    gstList: Array<{ gstin: string; status: string; state: string }>;

    // Step 3: CIN Details (if applicable)
    hasCIN: boolean | null;
    cinNumber: string;
    cinVerified: boolean;
    cinResponse: any;

    // Step 4: Director Details
    selectedDirector: string;
    directorList: Director[];

    // Step 5: Documents
    documents: Documents;

    // Step 6: Bank Details
    accountNumber: string;
    ifscCode: string;
    phone: string;
    bankName: string;
    bankVerified: boolean;
    bankResponse: any;

    // Step 7: Business Details
    websiteLink: string;
    lineOfBusiness: string;
    // contactUs: string;
    mobileAppLink: string;
    tncLink: string;
    refundPolicyLink: string;
    cancellationPolicyLink: string;
    contactSupportInfo: string;
}

// interface ValidationErrors {
//     [key: string]: string;
// }



const VendorOnboarding: React.FC = () => {
    const { user } = useUser();
    // const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { addToast } = useToast();
    const { setUserInStore} = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        panNumber: '',
        panName: '',
        // dob: '',
        panVerified: false,
        panResponse: null,
        gstNumber: '',
        businessName: '',
        gstVerified: false,
        gstResponse: null,
        gstList: [],
        hasCIN: null,
        cinNumber: '',
        cinVerified: false,
        cinResponse: null,
        selectedDirector: '',
        directorList: [],
        documents: {
            pan: null,
            boardResolution: null,
            cinCertificate: null,
            aoa: null,
            moa: null,
            bankCheque: null
        },
        accountNumber: '',
        ifscCode: '',
        phone: '',
        bankName: '',
        bankVerified: false,
        bankResponse: null,
        websiteLink: '',
        lineOfBusiness: '',
        mobileAppLink: '',
        tncLink: '',
        refundPolicyLink: '',
        cancellationPolicyLink: '',
        contactSupportInfo: '',
    });



    const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Validation functions (unchanged from your code)
    const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
    const validateCIN = (cin: string) => /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cin);
    const validateIFSC = (ifsc: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

    // API Calls (unchanged from your code)
    const verifyPAN = async () => {
        if (!validatePAN(formData.panNumber) || !formData.panName) {
            addToast('Please fill all PAN details correctly', 'error');
            return;
        }

        setLoading(true);
        // setErrors({}); // Clear previous errors
        try {
            const response = await fetch(`${verfifyUrl}/pan/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pan: formData.panNumber,
                    name: formData.panName,
                    // dob: formData.dob
                })
            });

            const result = await response.json();

            if (result.data?.valid == true) {
                updateFormData('panVerified', true);
                updateFormData('panResponse', result.data);
                await fetchGSTList();
                addToast('PAN verified successfully!', 'success');
            } else {
                // Show specific error message from API
                const errorMessage = result.data?.message || result.message || 'PAN verification failed';
                // setErrors({ panNumber: errorMessage });
                addToast(errorMessage, 'error');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'PAN verification failed';
            // setErrors({ panNumber: errorMessage });
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchGSTList = async () => {
        try {
            const response = await fetch(`${verfifyUrl}/gst-list/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pan: formData.panNumber })
            });

            const result = await response.json();
            if (result.data.gstinList && result.data.gstinList.length > 0) {
                updateFormData('gstList', result.data.gstinList);
            }
        } catch (error) {
            console.error('Failed to fetch GST list');
        }
    };

    const verifyGST = async () => {
        if (!validateGST(formData.gstNumber)) {
            addToast('Invalid GST format', 'error');
            return;
        }

        if (!formData.businessName) {
            addToast('Please enter business name', 'error');
            return;
        }

        setLoading(true);
        // setErrors({});
        try {
            const response = await fetch(`${verfifyUrl}/gst/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gstin: formData.gstNumber,
                    businessName: formData.businessName
                })
            });

            const result = await response.json();

            if (result.data?.valid) {
                updateFormData('gstVerified', true);
                updateFormData('gstResponse', result.data);
                addToast('GST verified successfully!', 'success');

                if (result.data?.constitutionOfBusiness?.toLowerCase().includes('limited') ||
                    result.data?.constitutionOfBusiness?.toLowerCase().includes('company')) {
                    updateFormData('hasCIN', true);
                }
            } else {
                // Enhanced error handling
                const errorMessage = result.data?.message || result.message || 'GST verification failed';
                // setErrors({ gstNumber: errorMessage });
                addToast(errorMessage, 'error');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'GST verification failed';
            // setErrors({ gstNumber: errorMessage });
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyCIN = async () => {
        if (!validateCIN(formData.cinNumber)) {
            addToast('Invalid CIN format', 'error');
            return;
        }

        setLoading(true);
        // setErrors({});
        try {
            const response = await fetch(`${verfifyUrl}/cin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cin: formData.cinNumber })
            });

            const result = await response.json();

            if (result.data?.status === 'VALID' && result.data?.cinStatus === 'ACTIVE') {
                updateFormData('cinVerified', true);
                updateFormData('cinResponse', result.data);
                updateFormData('directorList', result.data?.directorDetails);
                addToast('CIN verified successfully!', 'success');
            } else {
                const errorMessage = result.data?.message || result.message || 'CIN verification failed';
                // setErrors({ cinNumber: errorMessage });
                addToast(errorMessage, 'error');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'CIN verification failed';
            // setErrors({ cinNumber: errorMessage });
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyBank = async () => {
        if (!formData.accountNumber || !validateIFSC(formData.ifscCode) || !formData.phone) {
            addToast('Please fill all bank details correctly', 'error');
            return;
        }

        setLoading(true);
        // setErrors({});
        try {
            const response = await fetch(`${verfifyUrl}/bank/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bankAccount: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    name: formData.bankName,
                    phone: formData.phone
                })
            });

            const result = await response.json();

            if (result.data?.accountStatus === 'VALID') {
                updateFormData('bankVerified', true);
                updateFormData('bankResponse', result.data);
                addToast('Bank details verified successfully!', 'success');
            } else {
                const errorMessage = result.data?.message || result.message || 'Bank verification failed';
                // setErrors({ bankDetails: errorMessage });
                addToast(errorMessage, 'error');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Bank verification failed';
            // setErrors({ bankDetails: errorMessage });
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (docType: keyof Documents, file: File | null) => {
        updateFormData('documents', {
            ...formData.documents,
            [docType]: file
        });
    };

    const getSteps = () => {
        const steps = [
            { id: 1, title: 'PAN Verification', icon: <FileText className="w-4 h-4" />, description: 'Verify your PAN details' },
            { id: 2, title: 'GST Details', icon: <Building className="w-4 h-4" />, description: 'Enter your GST information' }
        ];

        let stepId = 3;

        if (formData.hasCIN === true) {
            steps.push({ id: stepId++, title: 'CIN Details', icon: <Building className="w-4 h-4" />, description: 'Company incorporation details' });
        }

        if (formData.directorList.length > 0) {
            steps.push({ id: stepId++, title: 'Director', icon: <User className="w-4 h-4" />, description: 'Select company director' });
        }

        // Move Bank Details before Documents
        steps.push(
            { id: stepId++, title: 'Bank Details', icon: <CreditCard className="w-4 h-4" />, description: 'Add your bank account' }
        );

        // Add Documents step only after bank verification
        if (formData.bankVerified) {
            steps.push({ id: stepId++, title: 'Documents', icon: <Upload className="w-4 h-4" />, description: 'Upload required documents' });
        }

        steps.push(
            { id: stepId++, title: 'Business Info', icon: <Globe className="w-4 h-4" />, description: 'Complete business profile' }
        );

        return steps;
    };

    const steps = getSteps();

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
            // setErrors({});
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            // setErrors({});
        }
    };

    const renderStepIndicator = () => (
        <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out ${currentStep > step.id
                                ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                                : currentStep === step.id
                                    ? 'bg-white border-teal-600 text-teal-600 shadow-md ring-2 ring-teal-100'
                                    : 'border-gray-200 text-gray-400 bg-white'
                                }`}
                        >
                            {currentStep > step.id ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                React.cloneElement(step.icon, { className: "w-4 h-4" })
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`w-8 h-0.5 mx-1 transition-all duration-300 ${currentStep > step.id ? 'bg-teal-600' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Enhanced step title with better styling */}
            <div className="text-center px-3 w-full">
                <div className="inline-flex items-center bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg px-4 py-2 mb-2 border border-teal-100 shadow-sm">
                    <span className="text-teal-700 font-medium text-sm mr-2">
                        Step {currentStep} of {steps.length}
                    </span>
                    <div className="h-4 w-px bg-teal-200 mx-2"></div>
                    <h3 className="text-lg font-semibold text-teal-800">
                        {steps.find(step => step.id === currentStep)?.title}
                    </h3>
                </div>
            </div>
        </div>
    );

    const renderPANStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                    <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name as per PAN *</label>
                    <input
                        type="text"
                        value={formData.panName}
                        onChange={(e) => updateFormData('panName', e.target.value)}
                        placeholder="Enter name exactly as on PAN card"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateFormData('dob', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div> */}
            </div>

            {!formData.panVerified && (
                <button
                    onClick={verifyPAN}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify PAN
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            )}

            {formData.panVerified && formData.panResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">PAN Verified Successfully</span>
                    </div>
                    <div className="text-sm text-green-700">
                        <p>Status: {formData.panResponse.valid ? 'Valid' : 'Invalid'}</p>
                        <p>Reference ID: {formData.panResponse.referenceId}</p>
                    </div>
                </div>
            )}

            {/* {errors.panNumber && (
    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {errors.panNumber}
        </p>
    </div>
)} */}
        </div>
    );

    const renderGSTStep = () => (
        <div className="space-y-6">

            {formData.gstList.length > 0 ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select GST Number</label>
                    <div className="space-y-3">
                        {formData.gstList.map((gst, index) => (
                            <label key={index} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.gstNumber === gst.gstin ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-gray-300 hover:border-teal-300'}`}>
                                <input
                                    type="radio"
                                    name="gstSelection"
                                    value={gst.gstin}
                                    checked={formData.gstNumber === gst.gstin}
                                    onChange={() => updateFormData('gstNumber', gst.gstin)}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <div className="font-medium text-gray-800">{gst.gstin}</div>
                                    <div className="text-sm text-gray-600 mt-1">{gst.state} - {gst.status}</div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name as per GST *</label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="Enter business name as registered in GST"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number *</label>
                        <input
                            type="text"
                            value={formData.gstNumber}
                            onChange={(e) => updateFormData('gstNumber', e.target.value.toUpperCase())}
                            placeholder="29ABCDE1234F1Z5"
                            maxLength={15}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name as per GST *</label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="Enter business name as registered in GST"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                        />
                    </div>
                </div>
            )}

            {formData.gstNumber && !formData.gstVerified && (
                <button
                    onClick={verifyGST}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify GST
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            )}

            {formData.gstVerified && formData.gstResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">GST Verified Successfully</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Legal Name:</strong> {formData.gstResponse.legalNameOfBusiness}</p>
                        <p><strong>Trade Name:</strong> {formData.gstResponse.tradeNameOfBusiness}</p>
                        <p><strong>Constitution:</strong> {formData.gstResponse.constitutionOfBusiness}</p>
                        <p><strong>Status:</strong> {formData.gstResponse.gstinStatus}</p>
                    </div>
                </div>
            )}

            {/* {errors.gstNumber && (
    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {errors.gstNumber}
        </p>
    </div>
)} */}
        </div>
    );

    const renderCINStep = () => (
        <div className="space-y-6">

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CIN Number *</label>
                <input
                    type="text"
                    value={formData.cinNumber}
                    onChange={(e) => updateFormData('cinNumber', e.target.value.toUpperCase())}
                    placeholder="U72900KA2015PTC082988"
                    maxLength={21}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                />
            </div>

            {formData.cinNumber && !formData.cinVerified && (
                <button
                    onClick={verifyCIN}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify CIN
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            )}

            {formData.cinVerified && formData.cinResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">CIN Verified Successfully</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Company:</strong> {formData.cinResponse.companyName}</p>
                        <p><strong>Status:</strong> {formData.cinResponse.cinStatus}</p>
                        <p><strong>Incorporation Date:</strong> {formData.cinResponse.incorporationDate}</p>
                    </div>
                </div>
            )}

            {/* {errors.cinNumber && (
    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {errors.cinNumber}
        </p>
    </div>
)} */}
        </div>
    );

    const renderDirectorStep = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Director</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.directorList.map((director, index) => (
                    <div
                        key={index}
                        onClick={() => updateFormData('selectedDirector', director.name)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.selectedDirector === director.name
                            ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500 ring-opacity-50'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-gray-800 text-base tracking-tight">
                                    {director.name}
                                </div>
                                {formData.selectedDirector === director.name && (
                                    <div className="w-5 h-5 flex items-center justify-center bg-teal-500 rounded-full">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1.5">
                                <span className="font-medium">DIN:</span> {director.din}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {director.designation}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDocumentStep = () => {
        // Classify documents into categories
        const documentCategories = [
            {
                title: "Vendor Documents",
                description: "Personal identification documents required for verification",
                documents: [
                    { key: "pan", label: "PAN Card", description: "Upload scanned copy of PAN card" }
                ]
            },
            {
                title: "Business Documents",
                description: "Official business registration and authorization documents",
                documents: [
                    { key: "aoa", label: "AOA", description: "Certificate of Appointment / Authority (aoa)" },
                    { key: "moa", label: "MOA", description: "Memorandum of Association (MOA)" },
                    ...(formData.cinVerified ? [
                        { key: "boardResolution", label: "Board Resolution", description: "Authorizing signatory for business" },
                        { key: "cinCertificate", label: "CIN Certificate", description: "Company incorporation certificate" }
                    ] : [])
                ]
            },
            {
                title: "Bank Documents",
                description: "Bank verification documents",
                documents: [
                    { key: "bankCheque", label: "Cancelled/Voided Bank Cheque", description: "Upload a cancelled or voided cheque for bank verification" }
                ]
            }
        ];

        return (
            <div className="space-y-6">

                {/* Document categories in flexible layout */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 items-start">


                    {documentCategories.map((category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 grid-cols-1 items-start min-w-[300px]"
                        >
                            <h3 className="font-semibold text-gray-800 mb-1">{category.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                            <div className="space-y-3 grid grid-cols-2 gap-1">
                                {category.documents.map((doc) => (
                                    <div key={doc.key} className="border border-gray-300 rounded-lg p-3 bg-white transition-all hover:shadow-sm">
                                        <div className="flex items-center justify-between h-auto">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800 text-sm">{doc.label}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{doc.description}</p>

                                                {formData.documents[doc.key as keyof Documents] && (
                                                    <p className="text-xs text-green-600 mt-1 flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {(formData.documents[doc.key as keyof Documents] as any).name ||
                                                            (formData.documents[doc.key as keyof Documents] as any).filename ||
                                                            "File attached"}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                {formData.documents[doc.key as keyof Documents] ? (
                                                    <button
                                                        onClick={() => handleFileUpload(doc.key as keyof Documents, null)}
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileUpload(doc.key as keyof Documents, e.target.files?.[0] || null)}
                                                            className="hidden"
                                                            id={`doc-${doc.key}`}
                                                        />
                                                        <label
                                                            htmlFor={`doc-${doc.key}`}
                                                            className="flex items-center px-3 py-1.5 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition-all shadow-sm text-xs"
                                                        >
                                                            <Upload className="w-3 h-3 mr-1" />
                                                            Upload
                                                        </label>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    const renderBankStep = () => (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => updateFormData('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                    <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => updateFormData('ifscCode', e.target.value.toUpperCase())}
                        placeholder="SBIN0001234"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="1234567890"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                    <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => updateFormData('bankName', e.target.value)}
                        placeholder="Name as in bank records"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                </div>
            </div>

            {!formData.bankVerified && (
                <button
                    onClick={verifyBank}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify Bank Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            )}

            {formData.bankVerified && formData.bankResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Bank Details Verified</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Bank:</strong> {formData.bankResponse.bankName}</p>
                        <p><strong>Branch:</strong> {formData.bankResponse.branch}, {formData.bankResponse.city}</p>
                        <p><strong>Account Status:</strong> {formData.bankResponse.accountStatus}</p>
                    </div>
                </div>
            )}

            {/* {errors.bankDetails && (
    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {errors.bankDetails}
        </p>
    </div>
)} */}
        </div>
    );

    const renderBusinessStep = () => (
        <div className="w-full bg-gray-50 p-8 rounded-2xl shadow-md space-y-6 border border-gray-200">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 text-center pb-4 border-b border-gray-200">
                Business Information
            </h2>

            {/* Website Link */}
            <div>
                <input
                    type="url"
                    value={formData.websiteLink}
                    onChange={(e) => updateFormData("websiteLink", e.target.value)}
                    placeholder="Website Link"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Mobile App Link */}
            <div>
                <input
                    type="url"
                    value={formData.mobileAppLink}
                    onChange={(e) => updateFormData("mobileAppLink", e.target.value)}
                    placeholder="Mobile App Link"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Line of Business */}
            <div>
                <textarea
                    value={formData.lineOfBusiness}
                    onChange={(e) => updateFormData("lineOfBusiness", e.target.value)}
                    rows={3}
                    placeholder="Line of Business *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400 resize-none"
                />
            </div>

            {/* Terms & Conditions */}
            <div>
                <input
                    type="url"
                    value={formData.tncLink}
                    onChange={(e) => updateFormData("tncLink", e.target.value)}
                    placeholder="Terms & Conditions Link"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Refund Policy */}
            <div>
                <input
                    type="url"
                    value={formData.refundPolicyLink}
                    onChange={(e) => updateFormData("refundPolicyLink", e.target.value)}
                    placeholder="Refund Policy Link"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Cancellation Policy */}
            <div>
                <input
                    type="url"
                    value={formData.cancellationPolicyLink}
                    onChange={(e) => updateFormData("cancellationPolicyLink", e.target.value)}
                    placeholder="Cancellation Policy Link"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Contact Support */}
            <div>
                <textarea
                    value={formData.contactSupportInfo}
                    onChange={(e) => updateFormData("contactSupportInfo", e.target.value)}
                    rows={3}
                    placeholder="Contact Support Information *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2 italic">
                    Provide multiple contact methods for customer support
                </p>
            </div>
        </div>
    );






    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderPANStep();
            case 2: return renderGSTStep();
            case 3:
                if (formData.hasCIN === true) return renderCINStep();
                if (formData.directorList.length > 0) return renderDirectorStep();
                return renderBankStep(); // Changed from renderDocumentStep()
            case 4:
                if (formData.hasCIN === true && formData.directorList.length > 0) return renderDirectorStep();
                return renderBankStep(); // Changed from renderDocumentStep()
            case 5:
                return renderBankStep(); // Changed from renderDocumentStep()
            case 6:
                // Show Documents only if bank is verified
                if (formData.bankVerified) return renderDocumentStep();
                return renderBankStep();
            case 7:
                return renderBusinessStep();
            default:
                return renderPANStep();
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.panVerified;
            case 2: return formData.gstVerified && formData.businessName;
            case 3:
                if (formData.hasCIN === true) return formData.cinVerified;
                if (formData.directorList.length > 0) return formData.selectedDirector;
                return formData.bankVerified;
            case 4:
                if (formData.hasCIN === true && formData.directorList.length > 0) return formData.selectedDirector;
                return formData.bankVerified;
            case 5: return formData.bankVerified;
            case 6:
                // Check if all required documents are uploaded
                if (formData.bankVerified) {
                    const requiredDocs = ["pan", "aoa", "moa", "bankCheque"];
                    if (formData.cinVerified) {
                        requiredDocs.push("boardResolution", "cinCertificate");
                    }
                    return requiredDocs.every(docKey => formData.documents[docKey as keyof Documents] !== null);
                }
                return formData.bankVerified;
            case 7: return formData.lineOfBusiness && formData.contactSupportInfo;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const vendorId = user?.vendorId;
        const apiUrl = `${baseURL}/vendor/update/${vendorId}`;

        try {
            // Step 1: Build plain JSON object
            const jsonPayload: any = {};

            // PAN
            const panResponse = formData.panResponse
            if (panResponse) {
                jsonPayload.panNumber = panResponse.pan;
                jsonPayload.panName = panResponse.name;
                // jsonPayload.dob = panResponse.dob;
                jsonPayload.panStatus = panResponse.status;
            }
            jsonPayload.isPanVerified = formData.panVerified;

            // GST
            const gstResponse = formData.gstResponse
            if (gstResponse) {
                Object.assign(jsonPayload, {
                    gstin: gstResponse.gstin,
                    legalNameOfBusiness: gstResponse.legalNameOfBusiness,
                    tradeNameOfBusiness: gstResponse.tradeNameOfBusiness,
                    principalPlaceAddress: gstResponse.principalPlaceAddress,
                    constitutionOfBusiness: gstResponse.constitutionOfBusiness,
                    natureOfBusinessActivities: gstResponse.natureOfBusinessActivities,
                    gstinStatus: gstResponse.gstinStatus,
                    gstinValid: gstResponse.valid,
                });
            }
            jsonPayload.isGstVerified = formData.gstVerified;

            // CIN
            const cinResponse = formData.cinResponse
            if (cinResponse) {
                Object.assign(jsonPayload, {
                    cinNumber: cinResponse.cin,
                    companyName: cinResponse.companyName,
                    incorporationDate: cinResponse.incorporationDate,
                    cinStatus: cinResponse.cinStatus,
                });
            }
            jsonPayload.isCinVerified = formData.cinVerified;

            // Bank
            const bankResponse = formData.bankResponse
            if (bankResponse) {
                Object.assign(jsonPayload, {
                    accountNumber: bankResponse.bankAccount,
                    ifscCode: bankResponse.ifscDetails.ifsc,
                    bankName: bankResponse.bankName,
                    nameAtBank: bankResponse.nameAtBank,
                    bankCity: bankResponse.ifscDetails.city,
                    bankBranch: bankResponse.ifscDetails.branch,
                    bankStatus: bankResponse.accountStatus,
                    ifscDetails: bankResponse.ifscDetails,
                });
            }
            jsonPayload.isBankVerified = formData.bankVerified;

            // General Business
            Object.assign(jsonPayload, {
                websiteLink: formData.websiteLink,
                mobileAppLink: formData.mobileAppLink,
                lineOfBusiness: formData.lineOfBusiness,
                termAndConditionUrl: formData.tncLink,
                refundPolicyUrl: formData.refundPolicyLink,
                cancellationPolicyUrl: formData.cancellationPolicyLink,
                contactSupportInfo: formData.contactSupportInfo,
            });

            // Step 2: Create FormData
            const form = new FormData();

            // Add JSON as one field
            form.append("payload", JSON.stringify(jsonPayload));

            // Add files
            if (formData.documents) {
                for (const docKey in formData.documents) {
                    const document = (formData.documents as any)[docKey];
                    if (document && document instanceof File) {
                        form.append(docKey, document);
                    }
                }
            }
            console.log("Form data:", form);;
            // Step 3: Send request
            let response: any = await fetch(apiUrl, {
                method: "PATCH",
                body: form,
            });

            // response = await response.json();
            // console.log("response", response);

            if (!response.ok) throw new Error(response.message || "Submission failed");

            // console.log("Submission successful:", data);
            if (response.status === 200) {
                // const data = response.data;
                const data = await response.json();
                console.log("Submission response data:", data);
                const profile = data.data;
                // console.log("Login response data:", data);
                console.log("User profile:", profile);
                setUserInStore({
                    profile: profile,
                    // accessToken: data.data.accessToken,
                    // refreshToken: data.data.refreshToken,
                });
                // showToast("Login successful!", "success");
                const roleName = data?.data?.profile?.role?.roleName;
                console.log("User role:", roleName);

                if (roleName === "Admin" || roleName === "Super Admin") {
                    navigate("/");
                } else if (roleName === "Vendor") {
                    navigate("/");
                } else {
                    // const redirectPath = searchParams.get("redirect") || "/";
                    // navigate(redirectPath);
                    navigate('/');
                }
            }
            addToast("Vendor onboarding completed successfully!");
        } catch (error: any) {
            console.error("Submission failed:", error);
            addToast(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">

            <ToastContainer />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Compact Header Section */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-5 sm:px-6 py-6 text-white">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center bg-white/20 p-1.5 rounded-full backdrop-blur-sm mr-3">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">Vendor Onboarding</h1>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        {renderStepIndicator()}

                        <div className="mb-6 bg-white rounded-lg p-4">
                            {renderCurrentStep()}
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-gray-200 gap-3">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex items-center px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm w-full sm:w-auto justify-center text-sm"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1.5" />
                                Previous
                            </button>

                            <div className="text-xs text-gray-500 font-medium">
                                Step {currentStep} of {steps.length}
                            </div>

                            {currentStep < steps.length ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="flex items-center px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center text-sm"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-1.5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || loading}
                                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                                            Finalizing...
                                        </>
                                    ) : (
                                        <>
                                            Complete
                                            <CheckCircle className="w-4 h-4 ml-1.5" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                        Need assistance? Contact support at
                        <a href="mailto:support@example.com" className="text-teal-600 hover:text-teal-700 font-medium ml-1">
                            support@example.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VendorOnboarding;