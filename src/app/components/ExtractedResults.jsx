'use client';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ExtractedResults = ({ dataToDisplay }) => {
    const dataMapper = {
        name: 'Name',
        dob: 'DOB',
        policyNumber: 'Policy Number',
        claimNumber: 'Claim Number',
        surgeryDate: 'Surgery Date',
        typeOfSurgery: 'Type of Surgery',
        surgeonName: 'Surgeon Name',
        medicalProviderAddress: 'Medical Provider Address',
        surgeryCost: 'Surgery Cost',
        deductibleCost: 'Deductible Cost',
        conditionsRelatedToWork: 'Conditions Related To Work',
        addressOfCorrespondence: 'Address Of Correspondence',
        phoneNumber: 'Phone Number',
        emailAddress: 'Email Address',
        employerName: 'Employer Name'
    }
    return (
        <div>
            <h1 className='text-3xl'>Extracted Text</h1>
            {
                Object.keys(dataMapper).map((key, i) => (
                    <div key={i} >
                        { dataMapper[key] } : { dataToDisplay[key] ? dataToDisplay[key] : 'Not Found' }
                     </div>   
                ))
            }
        </div>
    )
}

export default ExtractedResults