// import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheck } from "react-icons/fa";

// const steps = [
//     { id: 1, label: "Cart", icon: <FaShoppingCart /> },
//     { id: 2, label: "Address", icon: <FaMapMarkerAlt /> },
//     { id: 3, label: "Payment", icon: <FaCreditCard /> },
//     { id: 4, label: "Done", icon: <FaCheck /> },
// ];

// export default function Stepper({ activeStep }) {

//     return (

//         <div className='mb-6 flex w-4/5 m-auto justify-between px-10 py-5 gap-8'>



//             <div className='flex-1 completed'>
//                 <div className='flex gap-8 items-center'>
//                     <button className='border border-gray-400 rounded-full p-2 outline outline-black/90 outline-offset-4'> <FaCheck /> </button>
//                     <div className='progress-bar overflow-hidden w-full h-1.5 bg-gray-300 rounded-full'>
//                         <div className='h-full'></div>
//                     </div>
//                 </div>
//                 <div className='mt-3 flex flex-col gap-1 '>
//                     <p className='font-semibold text-sm text-black/70'>Card Details</p>
//                     <span className='bg-green-100 text-xs w-fit px-4 py-1 rounded-full font-medium text-green-600'>completed</span>
//                 </div>
//             </div>
//             <div className='flex-1'>
//                 <div className='flex gap-8 items-center'>
//                     <button className='border border-gray-400 rounded-full p-2 outline outline-black/90 outline-offset-4'> <FaCheck /> </button>
//                     <div className='progress-bar overflow-hidden w-full h-1.5 bg-gray-300 rounded-full'>
//                         <div className='h-full'></div>
//                     </div>
//                 </div>
//                 <div className='mt-3 flex flex-col gap-1 '>
//                     <p className='font-semibold text-sm text-black/70'>Card Details</p>
//                     <span className='bg-green-100 text-xs w-fit px-4 py-1 rounded-full font-medium text-green-600'>completed</span>
//                 </div>
//             </div>
//             <div className='flex-1'>
//                 <div className='flex gap-8 items-center'>
//                     <button className='border border-gray-400 rounded-full p-2 outline outline-black/90 outline-offset-4'> <FaCheck /> </button>
//                     <div className='progress-bar overflow-hidden w-full h-1.5 bg-gray-300 rounded-full'>
//                         <div className='h-full'></div>
//                     </div>
//                 </div>
//                 <div className='mt-3 flex flex-col gap-1 '>
//                     <p className='font-semibold text-sm text-black/70'>Card Details</p>
//                     <span className='bg-green-100 text-xs w-fit px-4 py-1 rounded-full font-medium text-green-600'>completed</span>
//                 </div>
//             </div>
//             <div className=''>
//                 <div className='flex gap-8 items-center'>
//                     <button className='border border-gray-400 rounded-full p-2 outline outline-black/90 outline-offset-4'> <FaCheck /> </button>
//                     {/* <div className='w-full h-1.5 bg-green-600 rounded-full'></div> */}
//                 </div>
//                 <div className='mt-3 flex flex-col gap-1 '>
//                     <p className='font-semibold text-sm text-black/70'>Card Details</p>
//                     <span className='bg-green-100 text-xs w-fit px-4 py-1 rounded-full font-medium text-green-600'>completed</span>
//                 </div>
//             </div>
//         </div>
//     );
// }



import {
    FaShoppingCart,
    FaMapMarkerAlt,
    FaCreditCard,
    FaCheck
} from "react-icons/fa";

const steps = [
    { id: 1, label: "Cart", icon: <FaShoppingCart /> },
    { id: 2, label: "Address", icon: <FaMapMarkerAlt /> },
    { id: 3, label: "Payment", icon: <FaCreditCard /> },
    { id: 4, label: "Done", icon: <FaCheck /> },
];

export default function Stepper({ activeStep }) {
    return (
        // <div className="flex items-center justify-between w-full">
        //     {steps.map((step, index) => {
        //         const isCompleted = activeStep > step.id;
        //         const isCurrent = activeStep === step.id;
        //         const isPending = activeStep < step.id;

        //         return (
        //             <div key={step.id} className="flex items-center">
        //                 {/* STEP */}
        //                 <div className="flex flex-col items-center">
        //                     <div className="relative w-16 h-16">
        //                         <svg viewBox="0 0 120 120" className="w-full h-full">
        //                             {/* Background ring */}
        //                             <circle
        //                                 cx="60"
        //                                 cy="60"
        //                                 r="50"
        //                                 className={`fill-none stroke-[8] ${isPending ? "stroke-gray-300" : "stroke-green-200"}`}
        //                             />

        //                             {/* Progress ring */}
        //                             {(isCompleted || isCurrent) && (
        //                                 <circle
        //                                     cx="60"
        //                                     cy="60"
        //                                     r="50"
        //                                     className={`fill-none stroke-[8] stroke-green-500 stroke-round origin-center -rotate-90 ${isCurrent ? "animate-ring-fill" : ""} `}
        //                                     style={{
        //                                         strokeDasharray: 314,
        //                                         strokeDashoffset: isCompleted ? 0 : 314,
        //                                     }}
        //                                 />
        //                             )}
        //                         </svg>

        //                         {/* ICON */}
        //                         <div className={`absolute inset-0 flex items-center justify-center text-xl ${isCompleted ? "text-green-500" : isCurrent ? "text-blue-500" : "text-gray-400"} `}>
        //                             {isCompleted ? <FaCheck /> : step.icon}
        //                         </div>
        //                     </div>

        //                     {/* LABEL */}
        //                     <span className={`mt-2 text-sm font-medium ${isPending ? "text-gray-400" : "text-green-600"}`}>
        //                         {step.label}
        //                     </span>
        //                 </div>

        //                 {/* CONNECTOR */}
        //                 {index !== steps.length - 1 && (
        //                     <div className={`w-16 h-[2px] mx-3 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
        //                 )}
        //             </div>
        //         );
        //     })}
        // </div>

        <div className='mb-20 hidden md:flex  w-4/5 m-auto justify-between md:px-10 py-5 gap-8'>

            {
                steps.map((step, index) => {

                    const isCompleted = activeStep > step.id;
                    const isCurrent = activeStep === step.id;
                    const isPending = activeStep < step.id;

                    return (
                        <div key={index} className={`${step.id != 1 && 'flex-1'} ${(isCompleted || isCurrent) && "completed"} flex gap-8 items-center`}>
                            {
                                step.id != 1 && (
                                    <div className='progress-bar overflow-hidden w-full h-1.5 bg-gray-300 rounded-full'>
                                        <div className={`h-full rounded-full ${(isCompleted || isCurrent) && "animate-fill w-full! bg-green-500"} ${isPending && (step.id == Math.min(activeStep + 1,4)) ? "w-1/2 bg-blue-500" : "w-0"}`}></div>
                                    </div>
                                )
                            }
                            <div className='flex relative'>
                                <button className={`border border-gray-400 ${isCompleted ? "bg-green-600 text-white" : isCurrent ? "bg-blue-500 text-white outline-2 outline-blue-500 " : "text-gray-500"} rounded-full p-2 md:p-3 text-xs md:text-lg outline-offset-4`}> {step.icon} </button>
                                <div className='mt-3 flex flex-col gap-1 items-center absolute top-full left-1/2 -translate-x-1/2'>
                                    <p className='font-semibold text-mobile-1 md:text-sm text-black/70'>{step.label}</p>
                                    <span className={`text-mobile-1 md:text-xs w-fit text-nowrap px-2 py-1 md:px-4 md:py-1 rounded-full font-medium ${isCompleted ? "text-green-600 bg-green-100" : isCurrent ? "text-blue-500 bg-blue-100" : "text-gray-500 bg-gray-100" } `}> { isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending" } </span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    );
}

