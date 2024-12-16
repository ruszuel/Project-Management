import React from "react"

const Fields = (props) => {
    return (
        <div className="w-[100%] h-[100%] grid gap-1">
            {props.multiline ? (
                <textarea
                    className="w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400"
                    rows={props.rows || 4} 
                    placeholder={props.placeholder || ""}
                    disabled={true}
                ></textarea>
            ) : (
                <input
                    type="text"
                    className="w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400"
                    placeholder={props.placeholder || ""}
                />
            )}
        </div>
    );
};

export default Fields
