import React from 'react';

interface CheckResultProps {
    resultText: string; // or whatever type resultText is supposed to be
}

const CheckResult: React.FC<CheckResultProps> = ({ resultText }) => {
    return (
        <div className="row">
            <div className="text-center col-lg-12">
                <p className="mb-0 lead" style={{ fontSize: '3em', fontWeight: 'bold' }}>{resultText}</p>
            </div>
        </div>
    );
};

export default CheckResult;