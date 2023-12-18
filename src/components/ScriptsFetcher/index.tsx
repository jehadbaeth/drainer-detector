import React from 'react';

/**
 * Component that renders buttons to fetch scripts from the page
 */
const ScriptsFetcher = (props: {
    fetchScripts: () => void;
}) => {
    return (
        <div className="text-center col-lg-12 grid w-full grid-cols-2 gap-3 mt-3 ">
            <button
                className="btn"
                data-testid="Fetch Scripts"
                onClick={() => props.fetchScripts()}
            >
                Fetch & Check
            </button>
        </div>
    );
};

export default ScriptsFetcher;
