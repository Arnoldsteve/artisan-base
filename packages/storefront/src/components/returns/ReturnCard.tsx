import React from "react"; 
import { Button } from "@repo/ui/components/ui/button"; 
import { StatusProgressBar } from "./StatusProgressBar"; 

export function ReturnCard({ ret }: { ret: any }) { 
    return ( 
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-lg transition-shadow duration-300"> 
            <img 
                src={ret.productImage } 
                alt={ret.itemName} 
                className="w-24 h-24 object-cover rounded-md" 
            /> 
            <div className="flex-1"> 
                <h3 className="font-bold text-xl mb-1">{ret.itemName}</h3> 
                <p className="text-sm text-gray-600 mb-2">Order: {ret.orderNumber}</p> 
                <p className="text-sm italic text-gray-500 mb-4">{ret.returnReason}</p> 
                <StatusProgressBar steps={ret.statusSteps} /> 
            </div> 
            <div className="text-right flex flex-col gap-3 items-end w-full sm:w-auto"> 
                <div className="font-bold text-2xl text-gray-800">${ret.refundAmount.toFixed(2)}</div> 
                <div className="text-xs text-gray-500"> 
                    Est. complete: {ret.expectedCompletion} 
                </div> 
                <Button size="lg" className="w-full sm:w-auto">Track Return</Button> 
            </div> 
        </div> 
    ); 
}