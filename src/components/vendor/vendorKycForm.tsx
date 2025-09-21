import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, AlertCircle, CheckCircle, Building, FileText, CreditCard, Globe, Phone, X, User } from 'lucide-react';
import baseURL, { verfifyUrl } from '../../API/baseUrl';
import { useUser } from '../../store/slices/userSlice';




// interface Step {
//     id: number;
//     title: string;
//     icon: React.ReactNode;
// }

// Type definitions
interface Director {
    din: string;
    name: string;
    dob: string;
    designation: string;
    address: string;
}

interface Documents {
    pan: File | null;
    aadhar: File | null;
    boardResolution: File | null;
    cinCertificate: File | null;
    aoa: File | null;
    moa: File | null;
}

interface FormData {
    // Step 1: PAN Details
    panNumber: string;
    panName: string;
    dob: string;
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

interface ValidationErrors {
    [key: string]: string;
}


const VendorOnboarding: React.FC = () => {

    const { user } = useUser();


    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        panNumber: '',
        panName: '',
        dob: '',
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
            aadhar: null,
            boardResolution: null,
            cinCertificate: null,
            aoa: null,
            moa: null
        },
        accountNumber: '',
        ifscCode: '',
        phone: '',
        bankName: '',
        bankVerified: false,
        bankResponse: null,
        websiteLink: '',
        lineOfBusiness: '',
        // contactUs: '',
        mobileAppLink: '',
        tncLink: '',
        refundPolicyLink: '', 
        cancellationPolicyLink: '', 
        contactSupportInfo: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
    const validateCIN = (cin: string) => /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cin);
    const validateIFSC = (ifsc: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

    // API Calls
    const verifyPAN = async () => {
        if (!validatePAN(formData.panNumber) || !formData.panName || !formData.dob) {
            setErrors({ panNumber: 'Please fill all PAN details correctly' });
            return;
        }

        setLoading(true);
        try {
            // Mock API call - replace with actual endpoint
            const response = await fetch(`${verfifyUrl}/pan/lite/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pan: formData.panNumber,
                    name: formData.panName,
                    dob: formData.dob
                })
            });

            const result = await response.json();

            if (result.data.status === 'VALID') {
                updateFormData('panVerified', true);
                updateFormData('panResponse', result.data);
                await fetchGSTList();
            } else {
                setErrors({ panNumber: 'PAN verification failed' });
            }
        } catch (error) {
            setErrors({ panNumber: 'PAN verification failed' });
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
            setErrors({ gstNumber: 'Invalid GST format' });
            return;
        }

        if (!formData.businessName) {
            setErrors({ gstNumber: 'Please enter business name' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${verfifyUrl}/gst/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gstin: formData.gstNumber,
                    businessName: formData.businessName // Add business name to the request
                })
            });

            const result = await response.json();

            if (result.data.valid) {
                updateFormData('gstVerified', true);
                updateFormData('gstResponse', result.data);

                // Check if CIN is required based on business type
                if (result.data.constitutionOfBusiness?.toLowerCase().includes('limited') ||
                    result.data.constitutionOfBusiness?.toLowerCase().includes('company')) {
                    updateFormData('hasCIN', true);
                }
            } else {
                setErrors({ gstNumber: 'GST verification failed. Please check your GST number and business name.' });
            }
        } catch (error) {
            setErrors({ gstNumber: 'GST verification failed' });
        } finally {
            setLoading(false);
        }
    };

    const verifyCIN = async () => {
        if (!validateCIN(formData.cinNumber)) {
            setErrors({ cinNumber: 'Invalid CIN format' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${verfifyUrl}/cin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cin: formData.cinNumber })
            });

            const result = await response.json();

            if (result.data.status === 'VALID' && result.data.cinStatus === 'ACTIVE') {
                updateFormData('cinVerified', true);
                updateFormData('cinResponse', result.data);
                updateFormData('directorList', result.data.directorDetails);
            } else {
                setErrors({ cinNumber: 'CIN verification failed' });
            }
        } catch (error) {
            setErrors({ cinNumber: 'CIN verification failed' });
        } finally {
            setLoading(false);
        }
    };

    const verifyBank = async () => {
        if (!formData.accountNumber || !validateIFSC(formData.ifscCode) || !formData.phone) {
            setErrors({ bankDetails: 'Please fill all bank details correctly' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${verfifyUrl}/bank/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bankAccount: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    name: formData.panName,
                    phone: formData.phone
                })
            });

            const result = await response.json();

            if (result.data.accountStatus === 'VALID') {
                updateFormData('bankVerified', true);
                updateFormData('bankResponse', result.data);
            } else {
                setErrors({ bankDetails: 'Bank verification failed' });
            }
        } catch (error) {
            setErrors({ bankDetails: 'Bank verification failed' });
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
            { id: 1, title: 'PAN Verification', icon: <FileText className="w-4 h-4" /> },
            { id: 2, title: 'GST Details', icon: <Building className="w-4 h-4" /> }
        ];

        let stepId = 3;

        if (formData.hasCIN === true) {
            steps.push({ id: stepId++, title: 'CIN Details', icon: <Building className="w-4 h-4" /> });
        }

        if (formData.directorList.length > 0) {
            steps.push({ id: stepId++, title: 'Director', icon: <User className="w-4 h-4" /> });
        }

        steps.push(
            { id: stepId++, title: 'Documents', icon: <Upload className="w-4 h-4" /> },
            { id: stepId++, title: 'Bank Details', icon: <CreditCard className="w-4 h-4" /> },
            { id: stepId++, title: 'Business Info', icon: <Globe className="w-4 h-4" /> }
        );

        return steps;
    };

    const steps = getSteps();

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
            setErrors({});
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setErrors({});
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${currentStep > step.id
                            ? 'bg-teal-500 border-teal-500 text-white'
                            : currentStep === step.id
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : 'border-gray-300 text-gray-400'
                            }`}>
                            {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.icon}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-6 h-0.5 mx-1 ${currentStep > step.id ? 'bg-teal-500' : 'bg-gray-300'}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );


    const renderPANStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PAN Verification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name as per PAN</label>
                    <input
                        type="text"
                        value={formData.panName}
                        onChange={(e) => updateFormData('panName', e.target.value)}
                        placeholder="Enter name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateFormData('dob', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>

            {!formData.panVerified && (
                <button
                    onClick={verifyPAN}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Verifying...' : 'Verify PAN'}
                </button>
            )}

            {formData.panVerified && formData.panResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">PAN Verified Successfully</span>
                    </div>
                    <div className="text-sm text-green-700">
                        <p>Status: {formData.panResponse.status}</p>
                        <p>Reference ID: {formData.panResponse.referenceId}</p>
                    </div>
                </div>
            )}

            {errors.panNumber && (
                <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.panNumber}
                </p>
            )}
        </div>
    );

    const renderGSTStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">GST Details</h2>

            {formData.gstList.length > 0 ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select GST Number</label>
                    <div className="space-y-2">
                        {formData.gstList.map((gst, index) => (
                            <label key={index} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.gstNumber === gst.gstin ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="gstSelection"
                                    value={gst.gstin}
                                    checked={formData.gstNumber === gst.gstin}
                                    onChange={() => updateFormData('gstNumber', gst.gstin)}
                                    className="mr-3"
                                />
                                <div>
                                    <div className="font-medium">{gst.gstin}</div>
                                    <div className="text-sm text-gray-600">{gst.state} - {gst.status}</div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name as per GST</label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="Enter business name as registered in GST"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                    <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => updateFormData('gstNumber', e.target.value.toUpperCase())}
                        placeholder="29ABCDE1234F1Z5"
                        maxLength={15}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name as per GST</label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="Enter business name as registered in GST"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
            )}

            {formData.gstNumber && !formData.gstVerified && (
                <button
                    onClick={verifyGST}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Verifying...' : 'Verify GST'}
                </button>
            )}

            {formData.gstVerified && formData.gstResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

            {errors.gstNumber && (
                <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.gstNumber}
                </p>
            )}
        </div>
    );

    const renderCINStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">CIN Details</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CIN Number</label>
                <input
                    type="text"
                    value={formData.cinNumber}
                    onChange={(e) => updateFormData('cinNumber', e.target.value.toUpperCase())}
                    placeholder="U72900KA2015PTC082988"
                    maxLength={21}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {formData.cinNumber && !formData.cinVerified && (
                <button
                    onClick={verifyCIN}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Verifying...' : 'Verify CIN'}
                </button>
            )}

            {formData.cinVerified && formData.cinResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

            {errors.cinNumber && (
                <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.cinNumber}
                </p>
            )}
        </div>
    );

    const renderDirectorStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Director</h2>

            <div className="space-y-2">
                {formData.directorList.map((director, index) => (
                    <label key={index} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${formData.selectedDirector === director.name ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                        }`}>
                        <input
                            type="radio"
                            name="selectedDirector"
                            value={director.name}
                            checked={formData.selectedDirector === director.name}
                            onChange={() => updateFormData('selectedDirector', director.name)}
                            className="mr-3 mt-1"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{director.name}</div>
                            <div className="text-sm text-gray-600">DIN: {director.din}</div>
                            <div className="text-sm text-gray-600">{director.designation}</div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );

    const renderDocumentStep = () => {
        const requiredDocs = [
            { key: 'pan', label: 'PAN Card' },
            { key: 'aadhar', label: 'Aadhar Card' },
            ...(formData.cinVerified ? [
                { key: 'boardResolution', label: 'Board Resolution' },
                { key: 'cinCertificate', label: 'CIN Certificate' }
            ] : [])
        ];

        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Documents</h2>

                {requiredDocs.map(doc => (
                    <div key={doc.key} className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800">{doc.label}</h3>
                                {formData.documents[doc.key as keyof Documents] && (
                                    <p className="text-sm text-green-600">
                                        {formData.documents[doc.key as keyof Documents]!.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {formData.documents[doc.key as keyof Documents] ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <button
                                            onClick={() => handleFileUpload(doc.key as keyof Documents, null)}
                                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
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
                                            className="flex items-center px-3 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderBankStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => updateFormData('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => updateFormData('ifscCode', e.target.value.toUpperCase())}
                        placeholder="SBIN0001234"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="1234567890"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                        type="tel"
                        value={formData.bankName}
                        onChange={(e) => updateFormData('bankName', e.target.value)}
                        placeholder="Enter bank name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>

            {!formData.bankVerified && (
                <button
                    onClick={verifyBank}
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Verifying...' : 'Verify Bank Details'}
                </button>
            )}

            {formData.bankVerified && formData.bankResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

            {errors.bankDetails && (
                <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.bankDetails}
                </p>
            )}
        </div>
    );

    const renderBusinessStep = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Business Information</h2>

            {/* Website Link Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website Link</label>
                <input
                    type="url"
                    value={formData.websiteLink}
                    onChange={(e) => updateFormData('websiteLink', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Mobile App Link Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile App Link</label>
                <input
                    type="url"
                    value={formData.mobileAppLink}
                    onChange={(e) => updateFormData('mobileAppLink', e.target.value)}
                    placeholder="https://play.google.com/store/apps/your-app"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Line of Business Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Line of Business *</label>
                <textarea
                    value={formData.lineOfBusiness}
                    onChange={(e) => updateFormData('lineOfBusiness', e.target.value)}
                    rows={3}
                    placeholder="Describe your business activities and services"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* T&C Link Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions Link</label>
                <input
                    type="url"
                    value={formData.tncLink}
                    onChange={(e) => updateFormData('tncLink', e.target.value)}
                    placeholder="https://example.com/terms"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Refund Policy Link Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy Link</label>
                <input
                    type="url"
                    value={formData.refundPolicyLink}
                    onChange={(e) => updateFormData('refundPolicyLink', e.target.value)}
                    placeholder="https://example.com/refund"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Cancellation Policy Link Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy Link</label>
                <input
                    type="url"
                    value={formData.cancellationPolicyLink}
                    onChange={(e) => updateFormData('cancellationPolicyLink', e.target.value)}
                    placeholder="https://example.com/cancellation"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Contact Support Info Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Support Information</label>
                <textarea
                    value={formData.contactSupportInfo}
                    onChange={(e) => updateFormData('contactSupportInfo', e.target.value)}
                    rows={3}
                    placeholder="Email: support@example.com, Phone: +1-123-456-7890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
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
                return renderDocumentStep();
            case 4:
                if (formData.hasCIN === true && formData.directorList.length > 0) return renderDirectorStep();
                return renderDocumentStep();
            case 5:
                return renderDocumentStep();
            case 6:
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
                return Object.values(formData.documents).map(doc => doc !== null);
            case 4:
                if (formData.hasCIN === true && formData.directorList.length > 0) return formData.selectedDirector;
                return Object.values(formData.documents).map(doc => doc !== null);
            case 5: return Object.values(formData.documents).map(doc => doc !== null);
            case 6: return formData.bankVerified;
            case 7: return formData.lineOfBusiness && formData.contactSupportInfo;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        console.log(formData);
        console.log("start")
        setLoading(true);
        const vendorId = user.vendorId;
        const apiUrl = `${baseURL}/vendor/update/${vendorId}`;

        try {
            // Step 1: Build plain JSON object
            const jsonPayload: any = {};

            // PAN
            const panResponse = formData.panResponse
            if (panResponse) {
                jsonPayload.panNumber = panResponse.pan;
                jsonPayload.panName = panResponse.name;
                jsonPayload.dob = panResponse.dob;
                jsonPayload.panStatus = panResponse.status;
            }
            jsonPayload.isPanVerified = formData.panVerified;
            console.log("start1")
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
                    if (document instanceof File) {
                        form.append(docKey, document);
                    }
                }
            }
            console.log(form);
            // Step 3: Send request
            const response = await fetch(apiUrl, {
                method: "PATCH",
                body: form, // browser sets correct headers
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Submission failed");

            console.log("Submission successful:", data);
            alert("Vendor onboarding completed successfully!");
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };



    // const handleSubmit = async () => {
    //     setLoading(true);
    //     const vendorId = user.vendorId;
    //     const apiUrl = `${baseURL}/vendor/update/${vendorId}`;

    //     try {
    //         const formDataPayload = new FormData();

    //         // Iterate over the keys of the formData state object
    //         for (const key in formData) {
    //             // Check if the property is a direct property of the object
    //             if (Object.prototype.hasOwnProperty.call(formData, key)) {
    //                 const value = (formData)[key as keyof typeof formData];

    //                 // Skip the documents object, as it is handled separately
    //                 if (key === 'documents') {
    //                     continue;
    //                 }

    //                 // Handle different data types for FormData
    //                 if (Array.isArray(value)) {
    //                     // Append each item of the array individually
    //                     value.forEach(item => formDataPayload.append(key, item));
    //                 } else if (typeof value === 'boolean') {
    //                     // Convert booleans to a string representation
    //                     formDataPayload.append(key, value.toString());
    //                 } else if (value !== null && typeof value === 'object' && !isFile(value)) {
    //                     // Convert objects (like API responses) to a JSON string
    //                     formDataPayload.append(key, JSON.stringify(value));
    //                 } else if (value !== null) {
    //                     // For all other valid types (string, number, etc.), append directly
    //                     formDataPayload.append(key, value);
    //                 }
    //             }
    //         }

    //         // Handle file uploads from the documents object


    //         console.log("formdataPayload", formDataPayload);
    //         // Make the API call
    //         const response = await fetch(apiUrl, {
    //             method: 'PATCH',
    //             body: formDataPayload,
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             throw new Error(data.message || 'Submission failed');
    //         }
    //         console.log('Submission successful:', data);
    //         alert('Vendor onboarding completed successfully!');

    //         // Reset form on success
    //         // setFormData({
    //         //     panNumber: '',
    //         //     panName: '',
    //         //     dob: '',
    //         //     panVerified: false,
    //         //     panResponse: null,
    //         //     gstNumber: '',
    //         //     businessName: '',
    //         //     gstVerified: false,
    //         //     gstResponse: null,
    //         //     gstList: [],
    //         //     hasCIN: null,
    //         //     cinNumber: '',
    //         //     cinVerified: false,
    //         //     cinResponse: null,
    //         //     selectedDirector: '',
    //         //     directorList: [],
    //         //     documents: {
    //         //         pan: null,
    //         //         aadhar: null,
    //         //         boardResolution: null,
    //         //         cinCertificate: null,
    //         //         aoa: null,
    //         //         moa: null
    //         //     },
    //         //     accountNumber: '',
    //         //     ifscCode: '',
    //         //     phone: '',
    //         //     bankName: '',
    //         //     bankVerified: false,
    //         //     bankResponse: null,
    //         //     websiteLink: '',
    //         //     lineOfBusiness: '',
    //         //     mobileAppLink: '',
    //         //     tncLink: '',
    //         //     refundPolicyLink: '',
    //         //     cancellationPolicyLink: '',
    //         //     contactSupportInfo: '',
    //         // });
    //         // setCurrentStep(1);

    //     } catch (error: any) {
    //         console.error('Submission failed:', error);
    //         alert(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Vendor Onboarding</h1>
                        <p className="text-gray-600 text-center text-sm">Complete your registration in {steps.length} simple steps</p>
                    </div>

                    {renderStepIndicator()}

                    <div className="mb-6">
                        {renderCurrentStep()}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>

                        <div className="text-sm text-gray-500">
                            Step {currentStep} of {steps.length}
                        </div>

                        {currentStep < steps.length ? (
                            <button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!canProceed() || loading}
                                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Application
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorOnboarding;